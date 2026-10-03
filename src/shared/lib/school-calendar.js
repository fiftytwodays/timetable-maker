// School days from the working weekdays and the calendar entries (holidays
// and extra working days). Dates are "YYYY-MM-DD" strings in the school's
// local time. No imports, so the backend can share these rules.

export const WEEKDAYS = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 7, label: "Sunday", short: "Sun" },
];

export const DEFAULT_WORKING_WEEKDAYS = [1, 2, 3, 4, 5, 6];

export const getWorkingWeekdays = (school) =>
  school?.workingWeekdays?.length
    ? school.workingWeekdays
    : DEFAULT_WORKING_WEEKDAYS;

// 1 = Monday ... 7 = Sunday, independent of the runtime's time zone.
export const isoWeekday = (date) => {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
};

const covers = (entry, date) => entry.startDate <= date && date <= entry.endDate;

/**
 * Describes a date: whether it is a school day, and the holiday or extra
 * working day that applies. A holiday wins over an extra working day.
 */
export const getDayInfo = (date, { workingWeekdays, entries = [] }) => {
  const holiday = entries.find(
    (entry) => entry.type === "HOLIDAY" && covers(entry, date)
  );
  const workingDay = entries.find(
    (entry) => entry.type === "WORKING_DAY" && covers(entry, date)
  );
  const isWorkingWeekday = workingWeekdays.includes(isoWeekday(date));

  return {
    holiday,
    // Only reported where it changes something: on a normally-off day.
    extraWorkingDay: !holiday && !isWorkingWeekday ? workingDay : undefined,
    isSchoolDay: !holiday && (isWorkingWeekday || Boolean(workingDay)),
  };
};

export const isSchoolDay = (date, calendar) =>
  getDayInfo(date, calendar).isSchoolDay;
