import { assertNotReferenced, createCrudApi } from "@/shared/lib/amplify";
import { formatTimeRange } from "@/shared/lib/format-time";

import { getAllPeriods } from "./get-periods";

const { create, update, remove } = createCrudApi("Period");

// Times are "HH:mm", so comparing the strings compares the times.
const assertValidSchedule = async ({ id, startTime, endTime }) => {
  if (startTime >= endTime) {
    throw new Error("The end time must be after the start time.");
  }
  const periods = await getAllPeriods();
  const overlapping = periods.find(
    (period) =>
      period.id !== id &&
      period.startTime &&
      period.endTime &&
      period.startTime < endTime &&
      startTime < period.endTime
  );
  if (overlapping) {
    throw new Error(
      `This overlaps ${overlapping.name} (${formatTimeRange(
        overlapping.startTime,
        overlapping.endTime
      )}).`
    );
  }
};

export const createPeriod = async (values) => {
  await assertValidSchedule(values);
  return create(values);
};

export const updatePeriod = async (id, values) => {
  await assertValidSchedule({ id, ...values });
  // A break cannot hold lessons, so a period in use must stay a lesson.
  if (values.type === "BREAK") {
    await assertNotReferenced("Period", id, "timetableEntries", "the timetable");
  }
  return update(id, values);
};

export const deletePeriod = async (id) => {
  await assertNotReferenced("Period", id, "timetableEntries", "the timetable");
  return remove(id);
};
