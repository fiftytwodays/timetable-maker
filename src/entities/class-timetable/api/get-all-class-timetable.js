import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";

export const getAllClassTimetable = async (selectedClass, filter) => {
  const defaultFilter = (entry) =>
    entry?.expand?.class_sub_teach_ass?.expand?.class_name?.name ===
    selectedClass;
  const result = await listClassTimetable({
    sort: "-created",
    filter: filter || defaultFilter,
  });

  return result;
};
