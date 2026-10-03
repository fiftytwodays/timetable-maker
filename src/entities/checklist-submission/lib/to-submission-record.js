import { toRecord } from "@/shared/lib/amplify";

// JSON fields can come back as strings.
const parseJson = (value, fallback) =>
  typeof value === "string" ? JSON.parse(value) : value ?? fallback;

export const toSubmissionRecord = (item) => ({
  ...toRecord(item),
  items: parseJson(item.items, []),
  events: parseJson(item.events, []),
});
