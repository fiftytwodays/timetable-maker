import { toRecord } from "@/shared/lib/amplify";

/**
 * Maps a ClassSubjectTeacherAssociation to the PocketBase shape the UI reads:
 * relation ids on `class_name`/`teacher_name`/`subject_name` and the related
 * records under `expand`. `name` is derived from the related records so it
 * stays current when a class, subject or teacher is renamed.
 */
export const toCstaRecord = (item) =>
  item && {
    ...toRecord(item),
    name:
      [item.schoolClass?.name, item.subject?.name, item.teacher?.name]
        .filter(Boolean)
        .join(" - ") || item.name,
    class_name: item.classId,
    teacher_name: item.teacherId,
    subject_name: item.subjectId,
    expand: {
      class_name: item.schoolClass,
      teacher_name: item.teacher,
      subject_name: item.subject,
    },
  };
