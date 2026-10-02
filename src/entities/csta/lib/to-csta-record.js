import { toRecord } from "@/shared/lib/amplify";

/**
 * Maps a ClassSubjectTeacherAssociation to the PocketBase shape the UI reads:
 * relation ids on `class_name`/`teacher_name`/`subject_name` and the related
 * records under `expand`.
 */
export const toCstaRecord = (item) =>
  item && {
    ...toRecord(item),
    class_name: item.classId,
    teacher_name: item.teacherId,
    subject_name: item.subjectId,
    expand: {
      class_name: item.schoolClass,
      teacher_name: item.teacher,
      subject_name: item.subject,
    },
  };
