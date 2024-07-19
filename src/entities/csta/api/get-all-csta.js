import pb from "@/shared/lib/pocketbase";

export const getAllClassSubjectTeacherAssociation = async () => {
  const result = await pb
    .collection("ClassSubjectTeacherAssociation")
    .getFullList(200 /* batch size */, {
      sort: "created",
      expand: "class_name, teacher_name, subject_name",
    });

  return result;
};
