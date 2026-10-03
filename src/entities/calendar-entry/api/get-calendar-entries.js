import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllCalendarEntries = async () => {
  const result = await listAll(client.models.CalendarEntry);

  return sortRecords(result, "startDate").map(toRecord);
};
