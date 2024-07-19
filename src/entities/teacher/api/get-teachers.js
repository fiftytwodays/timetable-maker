import pb from "@/shared/lib/pocketbase";

export const getAllTeachers = async () => {
  const result = await pb
    .collection("teachers")
    .getFullList(200 /* batch size */, {
      sort: "-created",
    });

  return result;
};
