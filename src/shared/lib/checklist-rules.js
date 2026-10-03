// Rules for filling in checklists, shared by the app and the backend: which
// day or week a checklist is for, whether it is due, how late it can be
// filled in, and what a submission needs. Dates are "YYYY-MM-DD" strings in
// the school's time zone.

import { isSchoolDay, isoWeekday } from "./school-calendar.js";

export const SCHOOL_TIME_ZONE = "Asia/Kolkata";

export const todayInSchool = (now = new Date()) =>
  // The en-CA locale formats dates as YYYY-MM-DD.
  new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHOOL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

export const addDays = (date, days) => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
};

export const daysBetween = (from, to) =>
  Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86400000
  );

// Weeks run Monday to Sunday.
export const weekStart = (date) => addDays(date, 1 - isoWeekday(date));

/**
 * The day or week containing `date` that a checklist is filled in for. The
 * key identifies it: the date, the week's Monday, or "ONCE".
 */
export const getPeriod = (frequency, date) => {
  if (frequency === "ONCE") {
    return { periodKey: "ONCE", start: null, end: null };
  }
  if (frequency === "WEEKLY") {
    const start = weekStart(date);
    return { periodKey: start, start, end: addDays(start, 6) };
  }
  return { periodKey: date, start: date, end: date };
};

/** Daily checklists are due on school days, weekly ones in weeks with one. */
export const isPeriodDue = (frequency, period, calendar) => {
  if (frequency === "DAILY") {
    return isSchoolDay(period.start, calendar);
  }
  if (frequency === "WEEKLY") {
    return [0, 1, 2, 3, 4, 5, 6].some((offset) =>
      isSchoolDay(addDays(period.start, offset), calendar)
    );
  }
  return true;
};

/** Days back a checklist can be filled in; null means no limit. */
export const getLateDaysLimit = (checklist, school) => {
  if (checklist.lateLimit === "NO_LIMIT") {
    return null;
  }
  if (checklist.lateLimit === "CUSTOM") {
    return checklist.lateDays ?? 0;
  }
  return school?.checklistLateDays ?? null;
};

/**
 * Whether a period can be filled in on `today`, and whether doing so is
 * late (after the day or week ended). `reason` explains a refusal:
 * "NOT_STARTED" or "TOO_LATE".
 */
export const getFillInState = ({ frequency, period, today, lateDays }) => {
  if (frequency === "ONCE") {
    return { canFillIn: true, isLate: false };
  }
  if (period.start > today) {
    return { canFillIn: false, isLate: false, reason: "NOT_STARTED" };
  }
  const daysLate = daysBetween(period.end, today);
  if (daysLate <= 0) {
    return { canFillIn: true, isLate: false };
  }
  if (lateDays === null || daysLate <= lateDays) {
    return { canFillIn: true, isLate: true };
  }
  return { canFillIn: false, isLate: true, reason: "TOO_LATE" };
};

// Statuses in which the teacher can still change a submission.
export const EDITABLE_STATUSES = ["IN_PROGRESS", "RETURNED"];

export const submissionId = (checklistId, teacherId, periodKey) =>
  `${checklistId}_${teacherId}_${periodKey}`;

/** Activities that are not done and have no comment explaining why. */
export const getMissingComments = (items) =>
  items.filter((item) => !item.done && !item.comment?.trim());
