import { client, listAll, sortRecords } from "@/shared/lib/amplify";

import { toSubmissionRecord } from "../lib/to-submission-record";

const getSubmissions = async (filter) => {
  const result = await listAll(client.models.ChecklistSubmission, { filter });

  return sortRecords(result, "-periodStart").map(toSubmissionRecord);
};

/** A teacher's own submissions, newest period first. */
export const getTeacherSubmissions = (teacherId) =>
  getSubmissions({ teacherId: { eq: teacherId } });

/** Every submission; admins only. */
export const getAllSubmissions = () => getSubmissions();
