import { getAllClassTimetable } from "../api/get-all-class-timetable";
import { getOneClassSubjectTeacherAssociation } from "../api/get-one-csta";

export async function checkForCtaConflict(cstaId, dayId, periodId) {
  const csta = await getOneClassSubjectTeacherAssociation(cstaId);

  const conflictList = await getAllClassTimetable(
    "",
    `class_sub_teach_ass.teacher_name="${csta?.teacher_name}" && day="${dayId}" && period="${periodId}"`
  );

  const className =
    conflictList[0]?.expand?.class_sub_teach_ass?.expand?.class_name?.name;
  const teacherName =
    conflictList[0]?.expand?.class_sub_teach_ass?.expand?.teacher_name?.name;
  const subjectName =
    conflictList[0]?.expand?.class_sub_teach_ass?.expand?.subject_name?.name;

  const dayName = conflictList[0]?.expand?.day?.name;
  const periodName = conflictList[0]?.expand?.period?.name;

  return {
    isUnique: conflictList?.length === 0,
    description:
      conflictList?.length === 0
        ? "No conflicts"
        : `Conflict detected: ${className} - ${subjectName} with teacher ${teacherName} during ${periodName} on ${dayName}.`,
  };
}
