import { client, unwrap, toRecord } from "@/shared/lib/amplify";

export const createClassTimetable = async (
  class_sub_teach_ass,
  day,
  period
) => {
  const data = {
    cstaId: class_sub_teach_ass,
    dayId: day,
    periodId: period,
  };

  const result = await client.models.ClassTimetable.create(data);
  return toRecord(unwrap(result));
};
