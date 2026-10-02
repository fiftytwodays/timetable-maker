import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";
import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";
import { findSlotClash } from "@/entities/cta/lib/find-slot-clash";

import { getAllClassSubjectTeacherAssociation } from "./get-all-csta";

const { create, update, remove } = createCrudApi(
  "ClassSubjectTeacherAssociation"
);

const assertUnique = async ({ id, classId, subjectId, teacherId }) => {
  const associations = await getAllClassSubjectTeacherAssociation();
  const isTaken = associations.some(
    (association) =>
      association.id !== id &&
      association.classId === classId &&
      association.subjectId === subjectId &&
      association.teacherId === teacherId
  );

  if (isTaken) {
    throw new Error("This class, subject and teacher are already associated.");
  }
};

// Changing the class or teacher moves every timetable slot of the
// association, so each slot must still be free for the new class and teacher.
const assertTimetableStillValid = async (id, { classId, teacherId }) => {
  const entries = await listClassTimetable();

  for (const entry of entries.filter((entry) => entry.cstaId === id)) {
    const clash = findSlotClash(entries, {
      dayId: entry.dayId,
      periodId: entry.periodId,
      classId,
      teacherId,
      ignore: (other) => other.cstaId === id,
    });
    if (clash) {
      throw new Error(clash);
    }
  }
};

export const createClassSubjectTeacherAssociation = async (values) => {
  await assertUnique(values);
  return create(values);
};

export const updateClassSubjectTeacherAssociation = async (id, values) => {
  await assertUnique({ id, ...values });
  await assertTimetableStillValid(id, values);
  return update(id, values);
};

export const deleteClassSubjectTeacherAssociation = async (id) => {
  await assertNotReferenced(
    "ClassSubjectTeacherAssociation",
    id,
    "timetableEntries",
    "the timetable"
  );
  return remove(id);
};
