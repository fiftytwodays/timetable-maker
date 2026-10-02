import { listClassTimetable } from "./list-class-timetable";

export const getAllClassTimetableAssociation = async () => {
  const result = await listClassTimetable({ sort: "created" });

  return result;
};
