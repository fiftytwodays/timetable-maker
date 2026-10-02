import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllDays = async () => {
  const result = await listAll(client.models.Day);

  return sortRecords(result, "-created").map(toRecord);
};
