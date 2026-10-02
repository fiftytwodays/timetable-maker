import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";

export const getAllStudentsTimetable = async (selectedClass) => {
  const filter = (entry) =>
    entry?.expand?.class_sub_teach_ass?.expand?.class_name?.name ===
    selectedClass;
  const result = await listClassTimetable({ sort: "-created", filter });

  return result;
};
