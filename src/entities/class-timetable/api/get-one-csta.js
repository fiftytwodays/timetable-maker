import { client, unwrap } from "@/shared/lib/amplify";
import { toCstaRecord } from "@/entities/csta/lib/to-csta-record";

export const getOneClassSubjectTeacherAssociation = async (cstaId) => {
  const result = await client.models.ClassSubjectTeacherAssociation.get({
    id: cstaId,
  });

  return toCstaRecord(unwrap(result));
};
