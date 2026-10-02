import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllPeriods = async (sort = "name") => {
  const result = await listAll(client.models.Period);

  return sortRecords(result, sort).map(toRecord);
};
