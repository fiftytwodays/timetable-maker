import pb from "@/shared/lib/pocketbase";

export const getAllPeriods = async (sort = "name") => {
  const result = await pb
    .collection("periods")
    .getFullList(200 /* batch size */, {
      sort: sort,
    });

  return result;
};
