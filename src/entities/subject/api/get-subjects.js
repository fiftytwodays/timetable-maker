import pb from "@/shared/lib/pocketbase";

export const getAllSubjects = async (sort = "name") => {
  const result = await pb
    .collection("subjects")
    .getFullList(200 /* batch size */, {
      sort: sort,
    });

  return result;
};
