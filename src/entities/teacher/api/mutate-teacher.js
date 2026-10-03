import {
  assertNotReferenced,
  client,
  createCrudApi,
  deleteWhere,
  listAll,
  unwrap,
} from "@/shared/lib/amplify";

const { create, update, remove } = createCrudApi("Teacher");
const assignments = createCrudApi("ChecklistAssignment");

// A cleared select is undefined, which an update would ignore.
const withCoordinator = (values) =>
  "coordinatorId" in values
    ? { ...values, coordinatorId: values.coordinatorId || null }
    : values;

export const createTeacher = (values) => create(withCoordinator(values));

export const updateTeacher = (id, values) => update(id, withCoordinator(values));

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

// Teachers coordinated by a deleted teacher are left without a coordinator.
const removeAsCoordinator = async (id) => {
  const coordinated = await listAll(client.models.Teacher, {
    filter: { coordinatorId: { eq: id } },
    selectionSet: ["id"],
  });
  await Promise.all(
    coordinated.map((teacher) => update(teacher.id, { coordinatorId: null }))
  );
};

/**
 * `deleteSubmissions` also deletes the teacher's checklist submissions;
 * otherwise they are kept as history.
 */
export const deleteTeacher = async (id, { deleteSubmissions = false } = {}) => {
  await assertNotReferenced(
    "Teacher",
    id,
    "associations",
    "class-subject-teacher associations"
  );
  await removeChecklistAssignments(id);
  await removeAsCoordinator(id);
  if (deleteSubmissions) {
    await deleteWhere("ChecklistSubmission", { teacherId: { eq: id } });
  }
  return remove(id);
};
