import pb from "@/shared/lib/pocketbase";

export const getOneClassSubjectTeacherAssociation = async (cstaId) => {
  const result = await pb
    .collection("ClassSubjectTeacherAssociation")
    .getOne(cstaId);

  return result;
};
