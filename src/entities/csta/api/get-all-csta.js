import { client, listAll, sortRecords } from "@/shared/lib/amplify";

import { toCstaRecord } from "../lib/to-csta-record";

export const cstaSelectionSet = [
  "id",
  "name",
  "classId",
  "teacherId",
  "subjectId",
  "createdAt",
  "updatedAt",
  "schoolClass.id",
  "schoolClass.name",
  "teacher.id",
  "teacher.name",
  "subject.id",
  "subject.name",
];

export const getAllClassSubjectTeacherAssociation = async () => {
  const result = await listAll(client.models.ClassSubjectTeacherAssociation, {
    selectionSet: cstaSelectionSet,
  });

  return sortRecords(result, "created").map(toCstaRecord);
};
