import { toRecord } from "@/shared/lib/amplify";

/**
 * Maps a Checklist to the shape the list and form use: items in order as
 * `{ id, title }`, and the assigned teachers as ids and display names.
 */
export const toChecklistRecord = (item) => {
  const items = [...(item.items || [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(({ id, title }) => ({ id, title }));
  const assignments = item.assignments || [];

  return {
    ...toRecord(item),
    lateLimit: item.lateLimit || "SCHOOL_DEFAULT",
    items,
    itemCount: items.length,
    assignments,
    teacherIds: assignments.map((assignment) => assignment.teacherId),
    teacherNames: assignments
      .map((assignment) => assignment.teacher?.name)
      .filter(Boolean)
      .sort()
      .join(", "),
  };
};
