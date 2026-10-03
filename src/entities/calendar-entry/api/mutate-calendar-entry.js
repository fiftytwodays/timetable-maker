import { createCrudApi } from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("CalendarEntry");

// A single day is saved as a range that starts and ends on that day.
const withEndDate = (values) => ({
  ...values,
  endDate: values.endDate || values.startDate,
});

export const createCalendarEntry = (values) => create(withEndDate(values));

export const updateCalendarEntry = (id, values) =>
  update(id, withEndDate(values));

export const deleteCalendarEntry = (id) => remove(id);
