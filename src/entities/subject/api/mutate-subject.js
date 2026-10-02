import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("Subject");

export const createSubject = create;

export const updateSubject = update;

export const deleteSubject = async (id) => {
  await assertNotReferenced(
    "Subject",
    id,
    "associations",
    "class-subject-teacher associations"
  );
  return remove(id);
};
