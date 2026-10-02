import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllSubjects = async (sort = "name") => {
  const result = await listAll(client.models.Subject);

  return sortRecords(result, sort).map(toRecord);
};
