import { createCrudApi } from "@/shared/lib/amplify";

const checklists = createCrudApi("Checklist");
const checklistItems = createCrudApi("ChecklistItem");
const assignments = createCrudApi("ChecklistAssignment");

const assertHasItems = (items = []) => {
  if (items.length === 0) {
    throw new Error("Add at least one activity to the checklist.");
  }
};

// Items keep their ids across edits, so completions recorded against an item
// (the teacher check-off screen) stay attached when the list is reordered.
const saveItems = async (checklistId, items = [], existingItems = []) => {
  const keptIds = new Set(items.map((item) => item.id).filter(Boolean));

  await Promise.all([
    ...existingItems
      .filter((item) => !keptIds.has(item.id))
      .map((item) => checklistItems.remove(item.id)),
    ...items.map((item, sortOrder) => {
      const title = item.title.trim();
      if (!item.id) {
        return checklistItems.create({ checklistId, title, sortOrder });
      }
      const existingIndex = existingItems.findIndex(
        (existing) => existing.id === item.id
      );
      const isUnchanged =
        existingIndex === sortOrder &&
        existingItems[existingIndex]?.title === title;
      return isUnchanged
        ? null
        : checklistItems.update(item.id, { title, sortOrder });
    }),
  ]);
};

const saveAssignments = async (
  checklistId,
  teacherIds = [],
  existingAssignments = []
) => {
  const assignedIds = new Set(
    existingAssignments.map((assignment) => assignment.teacherId)
  );

  await Promise.all([
    ...existingAssignments
      .filter((assignment) => !teacherIds.includes(assignment.teacherId))
      .map((assignment) => assignments.remove(assignment.id)),
    ...teacherIds
      .filter((teacherId) => !assignedIds.has(teacherId))
      .map((teacherId) => assignments.create({ checklistId, teacherId })),
  ]);
};

// Days back only apply to a custom limit; a hidden field is not submitted.
const withLateDays = ({ lateDays, ...fields }) => ({
  ...fields,
  lateDays: fields.lateLimit === "CUSTOM" ? lateDays : null,
});

export const createChecklist = async (values) => {
  const { items, teacherIds, ...fields } = withLateDays(values);
  assertHasItems(items);

  const checklist = await checklists.create(fields);
  await saveItems(checklist.id, items);
  await saveAssignments(checklist.id, teacherIds);
  return checklist;
};

export const updateChecklist = async (id, values, record) => {
  const { items, teacherIds, ...fields } = withLateDays(values);
  assertHasItems(items);

  const checklist = await checklists.update(id, fields);
  await saveItems(id, items, record.items);
  await saveAssignments(id, teacherIds, record.assignments);
  return checklist;
};

export const deleteChecklist = async (id, record) => {
  await Promise.all([
    ...(record?.items || []).map((item) => checklistItems.remove(item.id)),
    ...(record?.assignments || []).map((assignment) =>
      assignments.remove(assignment.id)
    ),
  ]);
  return checklists.remove(id);
};
