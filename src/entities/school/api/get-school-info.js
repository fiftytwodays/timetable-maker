import pb from "@/shared/lib/pocketbase";

export const getSchoolInfo = async () => {
  const result = await pb
    .collection("school")
    .getFullList(200 /* batch size */, {
      sort: "created",
    });

  return result;
};
