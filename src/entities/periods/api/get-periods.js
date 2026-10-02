import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

// Periods without times (created before times existed) go last, by name.
const bySchedule = (a, b) =>
  (a.startTime || "99:99").localeCompare(b.startTime || "99:99") ||
  (a.name || "").localeCompare(b.name || "");

/**
 * Lists the periods, in the order of the school day unless a table `sort`
 * is given.
 */
export const getAllPeriods = async (sort) => {
  const result = (await listAll(client.models.Period)).map(toRecord);

  return sort ? sortRecords(result, sort) : result.sort(bySchedule);
};
