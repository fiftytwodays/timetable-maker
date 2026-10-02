import { getUrl } from "aws-amplify/storage";

import { client, listAll, sortRecords, toRecord } from "@/shared/lib/amplify";

const getLogoUrl = async (logo) => {
  if (!logo) {
    return "";
  }
  const { url } = await getUrl({ path: logo });
  return url.toString();
};

export const getSchoolInfo = async () => {
  const result = await listAll(client.models.School);

  return Promise.all(
    sortRecords(result, "created").map(async (school) => ({
      ...toRecord(school),
      logoUrl: await getLogoUrl(school.logo),
    }))
  );
};
