import { client, unwrap } from "@/shared/lib/amplify";

export const deleteClassTimetable = async (cta_id) => {
  const result = await client.models.ClassTimetable.delete({ id: cta_id });
  return unwrap(result);
};
