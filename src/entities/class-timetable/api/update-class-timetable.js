import pb from "@/shared/lib/pocketbase";

export const updateClassTimetable = async (
  cta_id,
  class_sub_teach_ass,
  day,
  period
) => {
  const data = {
    class_sub_teach_ass: class_sub_teach_ass,
    day: day,
    period: period,
  };
  if (cta_id) {
    const result = await pb.collection("CTA").update(cta_id, data);
    return result;
  }
};
