import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllClasses = async () => {
  const result = await listAll(client.models.SchoolClass);

  return sortRecords(result, "created").map(toRecord);
};
