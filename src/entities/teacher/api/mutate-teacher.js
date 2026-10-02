import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("Teacher");

export const createTeacher = create;

export const updateTeacher = update;

export const deleteTeacher = async (id) => {
  await assertNotReferenced(
    "Teacher",
    id,
    "associations",
    "class-subject-teacher associations"
  );
  return remove(id);
};
