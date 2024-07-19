import pb from "@/shared/lib/pocketbase";

export const getAllPeriods = async () => {
  const result = await pb
    .collection("periods")
    .getFullList(200 /* batch size */, {
      sort: "-created",
    });

  return result;
};
