import pb from "@/shared/lib/pocketbase";

export const updateSchoolInfo = async (record_id, values) => {
  try {
    if (record_id) {
      const result = await pb.collection("School").update(record_id, values);
      return result;
    }
  } catch (error) {
    return error;
  }
};
