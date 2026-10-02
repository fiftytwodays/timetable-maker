import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

export const getAllTeachers = async () => {
  const result = await listAll(client.models.Teacher);

  return sortRecords(result, "-created").map(toRecord);
};
