import pb from "@/shared/lib/pocketbase";

export const getAllClasses = async () => {
  const result = await pb
    .collection("class")
    .getFullList(200 /* batch size */, {
      sort: "created",
    });

  return result;
};
