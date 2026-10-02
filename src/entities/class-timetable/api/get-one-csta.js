import { client, unwrap } from "@/shared/lib/amplify";
import { cstaSelectionSet } from "@/entities/csta/api/get-all-csta";
import { toCstaRecord } from "@/entities/csta/lib/to-csta-record";

export const getOneClassSubjectTeacherAssociation = async (cstaId) => {
  const result = await client.models.ClassSubjectTeacherAssociation.get(
    { id: cstaId },
    { selectionSet: cstaSelectionSet }
  );

  return toCstaRecord(unwrap(result));
};
