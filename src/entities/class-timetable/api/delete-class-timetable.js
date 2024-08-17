import pb from "@/shared/lib/pocketbase";

export const deleteClassTimetable = async (cta_id) => {
  const result = await pb.collection("CTA").delete(cta_id);
  return result;
};
