import { client, unwrap } from "@/shared/lib/amplify";

import { toSubmissionRecord } from "../lib/to-submission-record";

/**
 * Saves the signed-in teacher's checklist for the day or week containing
 * `date`, and submits it when `submit` is set. The backend checks the rules.
 */
export const saveSubmission = async ({ checklistId, date, items, submit }) => {
  const saved = unwrap(
    await client.mutations.saveChecklist({
      checklistId,
      date,
      items: JSON.stringify(
        items.map(({ itemId, done, comment }) => ({ itemId, done, comment }))
      ),
      submit,
    })
  );
  return toSubmissionRecord(
    typeof saved === "string" ? JSON.parse(saved) : saved
  );
};
