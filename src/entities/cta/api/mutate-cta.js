import { createCrudApi } from "@/shared/lib/amplify";
import { checkForCtaConflict } from "@/entities/class-timetable/lib/check-cta-conflit";

const { create, update, remove } = createCrudApi("ClassTimetable");

const assertSlotAvailable = async (id, { cstaId, dayId, periodId }) => {
  const { isUnique, description } = await checkForCtaConflict(
    cstaId,
    dayId,
    periodId,
    id
  );

  if (!isUnique) {
    throw new Error(description);
  }
};

export const createClassTimetableAssociation = async (values) => {
  await assertSlotAvailable(null, values);
  return create(values);
};

export const updateClassTimetableAssociation = async (id, values) => {
  await assertSlotAvailable(id, values);
  return update(id, values);
};

export const deleteClassTimetableAssociation = remove;
