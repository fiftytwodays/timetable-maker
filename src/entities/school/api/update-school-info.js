import { uploadData } from "aws-amplify/storage";

import { client, unwrap, toRecord } from "@/shared/lib/amplify";

/**
 * `values.logo` is a File to upload, `null` to remove the logo, or
 * `undefined` to keep the current one.
 */
export const updateSchoolInfo = async (record_id, values) => {
  try {
    if (record_id) {
      const { logo, ...fields } = values;
      const data = { id: record_id, ...fields };

      if (logo instanceof File) {
        const path = `school-logo/${record_id}/${Date.now()}-${logo.name}`;
        await uploadData({ path, data: logo }).result;
        data.logo = path;
      } else if (logo === null) {
        data.logo = null;
      }

      const result = await client.models.School.update(data);
      return toRecord(unwrap(result));
    }
  } catch (error) {
    return error;
  }
};
