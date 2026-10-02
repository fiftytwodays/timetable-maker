import { client, unwrap, toRecord } from "@/shared/lib/amplify";

export const updateClassTimetable = async (
  cta_id,
  class_sub_teach_ass,
  day,
  period
) => {
  const data = {
    id: cta_id,
    cstaId: class_sub_teach_ass,
    dayId: day,
    periodId: period,
  };
  if (cta_id) {
    const result = await client.models.ClassTimetable.update(data);
    return toRecord(unwrap(result));
  }
};
