import pb from "@/shared/lib/pocketbase";

export const getAllClassTimetableAssociation = async () => {
  const result = await pb.collection("CTA").getFullList(200 /* batch size */, {
    sort: "created",
    expand: "class_sub_teach_ass, day, period",
  });

  return result;
};
