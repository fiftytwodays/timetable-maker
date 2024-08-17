import pb from "@/shared/lib/pocketbase";

export const createClassTimetable = async (
  class_sub_teach_ass,
  day,
  period
) => {
  const data = {
    class_sub_teach_ass: class_sub_teach_ass,
    day: day,
    period: period,
  };

  const result = await pb.collection("CTA").create(data);
  return result;
};
