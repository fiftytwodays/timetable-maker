import type { AppSyncIdentityCognito } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/checklist-workflow";

import type { Schema } from "../../data/resource";
import {
  EDITABLE_STATUSES,
  getFillInState,
  getStartDate,
  getLateDaysLimit,
  getMissingComments,
  getPeriod,
  isChecklistDue,
  submissionId,
  todayInSchool,
} from "../../../src/shared/lib/checklist-rules.js";
import { getWorkingWeekdays } from "../../../src/shared/lib/school-calendar.js";

const { resourceConfig, libraryOptions } =
  await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

type Item = {
  itemId: string;
  title: string;
  done: boolean;
  comment: string | null;
};

type Event = {
  type: "SUBMITTED" | "RESUBMITTED" | "AUTO_REVIEWED" | "RETURNED" | "REVIEWED";
  at: string;
  by: string;
  comment?: string | null;
};

type SaveArguments = {
  checklistId: string;
  date: string;
  items: unknown;
  submit: boolean;
};

// The payload Amplify's function resolver sends.
type ResolverEvent = {
  fieldName: string;
  arguments: SaveArguments;
  identity: AppSyncIdentityCognito | null;
};

type Response<T> = {
  data: T;
  errors?: { message: string }[];
  nextToken?: string | null;
};

const unwrap = <T>({ data, errors }: Response<T>) => {
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
  return data;
};

const listAll = async <T>(
  list: (options: { nextToken?: string | null }) => Promise<Response<T[]>>
) => {
  const items: T[] = [];
  let nextToken: string | null | undefined = null;
  do {
    const response: Response<T[]> = await list({ nextToken });
    items.push(...unwrap(response));
    nextToken = response.nextToken;
  } while (nextToken);
  return items;
};

// JSON fields can come back as strings.
const parseJson = <T>(value: unknown, fallback: T): T => {
  if (typeof value === "string") {
    return JSON.parse(value) as T;
  }
  return (value as T) ?? fallback;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Builds the activities from the checklist, applying the teacher's input. */
const toItems = (
  checklistItems: { id: string; title: string; sortOrder: number | null }[],
  input: unknown
): Item[] => {
  const values = parseJson<{ itemId?: string; done?: unknown; comment?: unknown }[]>(
    input,
    []
  );
  if (!Array.isArray(values)) {
    throw new Error("The activities are not in the expected format.");
  }
  const byId = new Map(values.map((value) => [value.itemId, value]));

  return [...checklistItems]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => {
      const value = byId.get(item.id);
      const comment =
        typeof value?.comment === "string" ? value.comment.trim() : "";
      return {
        itemId: item.id,
        title: item.title,
        done: value?.done === true,
        comment: comment || null,
      };
    });
};

const saveChecklist = async (
  { checklistId, date, items: input, submit }: SaveArguments,
  identity: AppSyncIdentityCognito
) => {
  const today = todayInSchool();
  if (!DATE_PATTERN.test(date)) {
    throw new Error("The date is not valid.");
  }
  if (date > today) {
    throw new Error("You cannot fill in a checklist for a future date.");
  }

  const [teacher] = await listAll((options) =>
    client.models.Teacher.list({
      ...options,
      filter: { userId: { eq: identity.sub } },
    })
  );
  if (!teacher) {
    throw new Error("Your login is not linked to a teacher.");
  }

  const checklist = unwrap(
    await client.models.Checklist.get(
      { id: checklistId },
      {
        selectionSet: [
          "id",
          "title",
          "frequency",
          "lateLimit",
          "lateDays",
          "startDate",
          "createdAt",
          "items.id",
          "items.title",
          "items.sortOrder",
        ],
      }
    )
  );
  if (!checklist) {
    throw new Error("This checklist no longer exists.");
  }

  const assignments = await listAll((options) =>
    client.models.ChecklistAssignment.list({
      ...options,
      filter: {
        checklistId: { eq: checklistId },
        teacherId: { eq: teacher.id },
      },
    })
  );
  if (assignments.length === 0) {
    throw new Error("This checklist is not assigned to you.");
  }

  const [schools, entries] = await Promise.all([
    listAll((options) => client.models.School.list(options)),
    listAll((options) => client.models.CalendarEntry.list(options)),
  ]);
  const school = schools[0];
  const calendar = { workingWeekdays: getWorkingWeekdays(school), entries };

  const frequency = checklist.frequency ?? "DAILY";
  const period = getPeriod(frequency, date);
  const startDate = getStartDate(checklist);
  if (startDate && (frequency === "ONCE" ? date : period.end) < startDate) {
    throw new Error(`This checklist starts on ${startDate}.`);
  }
  if (!isChecklistDue({ ...checklist, frequency }, date, calendar)) {
    throw new Error(
      frequency === "WEEKLY"
        ? "That week has no school days."
        : "That day is not a school day."
    );
  }

  const fillIn = getFillInState({
    frequency,
    period,
    today,
    lateDays: getLateDaysLimit(checklist, school),
  });
  if (fillIn.reason === "NOT_STARTED") {
    throw new Error("You cannot fill in a checklist for a future date.");
  }
  if (fillIn.reason === "TOO_LATE") {
    throw new Error("It is too late to fill in this checklist.");
  }

  const id = submissionId(checklistId, teacher.id, period.periodKey);
  const existing = unwrap(await client.models.ChecklistSubmission.get({ id }));
  if (existing && !EDITABLE_STATUSES.includes(existing.status ?? "")) {
    throw new Error("This checklist has already been submitted.");
  }

  const items = toItems(checklist.items, input);
  if (submit) {
    const missing: Item[] = getMissingComments(items);
    if (missing.length > 0) {
      throw new Error(
        `Add a comment for each activity that is not done: ${missing
          .map((item) => item.title)
          .join(", ")}.`
      );
    }
  }

  const now = new Date().toISOString();
  const events = parseJson<Event[]>(existing?.events, []);
  const fields: Record<string, unknown> = {
    checklistId,
    teacherId: teacher.id,
    periodKey: period.periodKey,
    periodStart: period.start,
    frequency,
    items: JSON.stringify(items),
    checklistTitle: checklist.title,
    teacherName: teacher.name,
    teacherUserId: identity.sub,
    // A sent-back checklist stays sent back until it is submitted again.
    status: existing?.status === "RETURNED" ? "RETURNED" : "IN_PROGRESS",
  };

  if (submit) {
    // The coordinator needs a login to review; without one the checklist is
    // reviewed automatically.
    const coordinator = teacher.coordinatorId
      ? unwrap(await client.models.Teacher.get({ id: teacher.coordinatorId }))
      : null;
    const by = teacher.name ?? identity.username;

    events.push({
      type: existing?.status === "RETURNED" ? "RESUBMITTED" : "SUBMITTED",
      at: now,
      by,
    });
    Object.assign(fields, {
      submittedAt: now,
      isLate: fillIn.isLate,
      reviewComment: null,
    });

    if (coordinator?.userId) {
      Object.assign(fields, {
        status: "SUBMITTED",
        coordinatorId: coordinator.id,
        coordinatorUserId: coordinator.userId,
        coordinatorName: coordinator.name,
        autoReviewed: false,
      });
    } else {
      events.push({ type: "AUTO_REVIEWED", at: now, by: "SchoolDay" });
      Object.assign(fields, {
        status: "REVIEWED",
        coordinatorId: null,
        coordinatorUserId: null,
        coordinatorName: null,
        autoReviewed: true,
        reviewedAt: now,
        reviewedBy: null,
      });
    }
  }
  fields.events = JSON.stringify(events);

  const saved = existing
    ? await client.models.ChecklistSubmission.update({ id, ...fields } as never)
    : await client.models.ChecklistSubmission.create({ id, ...fields } as never);
  return unwrap(saved);
};

export const handler = async (event: ResolverEvent) => {
  if (!event.identity?.sub) {
    throw new Error("You must be signed in.");
  }
  if (event.fieldName === "saveChecklist") {
    return saveChecklist(event.arguments, event.identity);
  }
  throw new Error(`Unknown operation ${event.fieldName}`);
};
