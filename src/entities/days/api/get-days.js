import pb from "@/shared/lib/pocketbase";

export const getAllDays = async () => {
  const result = await pb.collection("days").getFullList(200 /* batch size */, {
    sort: "-created",
  });

  return result;
};
