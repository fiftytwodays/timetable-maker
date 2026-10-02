import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("Period");

export const createPeriod = create;

export const updatePeriod = update;

export const deletePeriod = async (id) => {
  await assertNotReferenced("Period", id, "timetableEntries", "the timetable");
  return remove(id);
};
