import { client, listAll, sortRecords } from "@/shared/lib/amplify";

import { toCtaRecord } from "../lib/to-cta-record";

const selectionSet = [
  "id",
  "cstaId",
  "dayId",
  "periodId",
  "createdAt",
  "updatedAt",
  "day.id",
  "day.name",
  "period.id",
  "period.name",
  "period.duration",
  "csta.id",
  "csta.name",
  "csta.classId",
  "csta.teacherId",
  "csta.subjectId",
  "csta.schoolClass.id",
  "csta.schoolClass.name",
  "csta.teacher.id",
  "csta.teacher.name",
  "csta.subject.id",
  "csta.subject.name",
];

/**
 * Lists every class timetable entry with its relations expanded.
 * DynamoDB cannot filter on related records, so `filter` runs client side
 * against the mapped (PocketBase shaped) records.
 */
export const listClassTimetable = async ({
  sort = "created",
  filter = () => true,
} = {}) => {
  const result = await listAll(client.models.ClassTimetable, { selectionSet });

  return sortRecords(result, sort).map(toCtaRecord).filter(filter);
};
