/**
 * Finds the first timetable entry that clashes with placing `classId` and
 * `teacherId` in a day/period slot: the class already has a lesson then, or
 * the teacher is already teaching another class. Returns a description of the
 * clash, or null when the slot is free.
 */
export const findSlotClash = (
  entries,
  { dayId, periodId, classId, teacherId, ignore = () => false }
) => {
  const clash = entries.find((entry) => {
    const csta = entry?.expand?.class_sub_teach_ass;
    return (
      !ignore(entry) &&
      entry?.dayId === dayId &&
      entry?.periodId === periodId &&
      (csta?.classId === classId || csta?.teacherId === teacherId)
    );
  });

  if (!clash) {
    return null;
  }

  const csta = clash.expand?.class_sub_teach_ass;
  const className = csta?.expand?.class_name?.name;
  const teacherName = csta?.expand?.teacher_name?.name;
  const subjectName = csta?.expand?.subject_name?.name;
  const dayName = clash.expand?.day?.name;
  const periodName = clash.expand?.period?.name;

  return `Conflict detected: ${className} - ${subjectName} with teacher ${teacherName} during ${periodName} on ${dayName}.`;
};
