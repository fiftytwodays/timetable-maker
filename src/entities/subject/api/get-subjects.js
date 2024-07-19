import pb from "@/shared/lib/pocketbase";

export const getAllSubjects = async () => {
  const result = await pb
    .collection("subjects")
    .getFullList(200 /* batch size */, {
      sort: "-created",
    });

  return result;
};
