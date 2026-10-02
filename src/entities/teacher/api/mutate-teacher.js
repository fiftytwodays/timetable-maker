import {
  assertNotReferenced,
  client,
  createCrudApi,
  unwrap,
} from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("Teacher");
const assignments = createCrudApi("ChecklistAssignment");

export const createTeacher = create;

export const updateTeacher = update;

// Checklist assignments only describe who does a checklist, so they are
// removed with the teacher instead of blocking the delete.
const removeChecklistAssignments = async (id) => {
  const teacher = unwrap(
    await client.models.Teacher.get(
      { id },
      { selectionSet: ["id", "checklistAssignments.id"] }
    )
  );
  await Promise.all(
    (teacher?.checklistAssignments || []).map((assignment) =>
      assignments.remove(assignment.id)
    )
  );
};

export const deleteTeacher = async (id) => {
  await assertNotReferenced(
    "Teacher",
    id,
    "associations",
    "class-subject-teacher associations"
  );
  await removeChecklistAssignments(id);
  return remove(id);
};
