import { client, listAll, sortRecords } from "@/shared/lib/amplify";

import { toChecklistRecord } from "../lib/to-checklist-record";

const selectionSet = [
  "id",
  "title",
  "description",
  "frequency",
  "lateLimit",
  "lateDays",
  "createdAt",
  "updatedAt",
  "items.id",
  "items.title",
  "items.sortOrder",
  "assignments.id",
  "assignments.teacherId",
  "assignments.teacher.name",
];

export const getAllChecklists = async () => {
  const result = await listAll(client.models.Checklist, { selectionSet });

  return sortRecords(result, "title").map(toChecklistRecord);
};
