import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";
import { findSlotClash } from "@/entities/cta/lib/find-slot-clash";

import { getOneClassSubjectTeacherAssociation } from "../api/get-one-csta";

/**
 * Checks whether a class-subject-teacher association can be placed in a slot.
 * `ctaId` is the timetable entry being replaced, which is not a conflict.
 */
export async function checkForCtaConflict(cstaId, dayId, periodId, ctaId) {
  const [csta, entries] = await Promise.all([
    getOneClassSubjectTeacherAssociation(cstaId),
    listClassTimetable(),
  ]);

  const description = findSlotClash(entries, {
    dayId,
    periodId,
    classId: csta?.classId,
    teacherId: csta?.teacherId,
    ignore: (entry) => entry.id === ctaId,
  });

  return {
    isUnique: !description,
    description: description || "No conflicts",
  };
}
