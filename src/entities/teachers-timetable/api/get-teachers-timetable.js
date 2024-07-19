import pb from "@/shared/lib/pocketbase";

export const getAllTeachersTimetable = async (selectedTeacher) => {
  const filter = `class_sub_teach_ass.teacher_name.name='${selectedTeacher}'`;
  const result = await pb.collection("CTA").getFullList(200 /* batch size */, {
    sort: "-created",
    filter: filter,
    expand:
      "class_sub_teach_ass, class_sub_teach_ass.subject_name, class_sub_teach_ass.class_name, day, period",
  });

  return result;
};
