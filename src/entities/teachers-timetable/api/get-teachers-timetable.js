import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";

export const getAllTeachersTimetable = async (selectedTeacher) => {
  const filter = (entry) =>
    entry?.expand?.class_sub_teach_ass?.expand?.teacher_name?.name ===
    selectedTeacher;
  const result = await listClassTimetable({ sort: "-created", filter });

  return result;
};
