// `logoUrl` is the signed S3 URL resolved by getSchoolInfo.
export const getImageUrl = (record) => {
  return record?.logoUrl || "";
};
