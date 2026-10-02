import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("SchoolClass");

export const createClass = create;

export const updateClass = update;

export const deleteClass = async (id) => {
  await assertNotReferenced(
    "SchoolClass",
    id,
    "associations",
    "class-subject-teacher associations"
  );
  return remove(id);
};
