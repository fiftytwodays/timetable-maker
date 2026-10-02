import { client, unwrap } from "@/shared/lib/amplify";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { updateTeacher } from "@/entities/teacher/api/mutate-teacher";

// Returns the teacher to link, checking it is not linked to another login.
const getAvailableTeacher = async (teacherId, user) => {
  if (!teacherId) {
    return null;
  }
  const teachers = await getAllTeachers();
  const teacher = teachers.find((teacher) => teacher.id === teacherId);
  if (!teacher) {
    throw new Error("The selected teacher no longer exists.");
  }
  if (teacher.userId && teacher.userId !== user?.sub) {
    throw new Error(
      `${teacher.name} already has the login "${teacher.username}".`
    );
  }
  return teacher;
};

const linkTeacher = (teacherId, user) =>
  teacherId &&
  updateTeacher(teacherId, { userId: user.sub, username: user.id });

const unlinkTeacher = (teacherId) =>
  teacherId && updateTeacher(teacherId, { userId: null, username: null });

/**
 * Creates a login. A login linked to a teacher uses the teacher's name. The
 * result includes `temporaryPassword`, which is only available now and must
 * be shown to the admin.
 */
export const createUser = async ({
  username,
  email,
  name,
  role,
  teacherId,
}) => {
  const teacher = await getAvailableTeacher(teacherId);
  const user = unwrap(
    await client.mutations.createUser({
      username,
      email: email || null,
      name: (teacher?.name ?? name) || null,
      role,
    })
  );
  await linkTeacher(teacherId, user);
  return user;
};

// True when the form has the field and its value differs from the record.
const isChanged = (values, record, field) =>
  field in values && (values[field] || null) !== (record[field] || null);

/**
 * Updates the fields present in `values`; the teacher link only changes when
 * `values` has a `teacherId` key. A linked login always takes the teacher's
 * current name, so calling this with no values re-syncs the name.
 */
export const updateUser = async (id, values, record) => {
  const { email, role, enabled } = values;
  const changesTeacher = "teacherId" in values;
  const teacherId = changesTeacher
    ? values.teacherId ?? null
    : record.teacherId ?? null;
  const teacher = await getAvailableTeacher(teacherId, record);

  // When unlinking, the form shows the last name, so the login keeps it.
  const name = teacher
    ? teacher.name
    : "name" in values
    ? values.name || ""
    : undefined;
  const changesName =
    name !== undefined && (name || null) !== (record.loginName ?? null);

  const user = unwrap(
    await client.mutations.updateUser({
      id,
      role,
      enabled,
      ...(isChanged(values, record, "email") && { email: email || "" }),
      ...(changesName && { name }),
    })
  );
  if (changesTeacher && teacherId !== record.teacherId) {
    await unlinkTeacher(record.teacherId);
    await linkTeacher(teacherId, user);
  }
  return user;
};

export const deleteUser = async (id, record) => {
  unwrap(await client.mutations.deleteUser({ id }));
  await unlinkTeacher(record?.teacherId);
  return true;
};

/** Sets and returns a new temporary password. */
export const resetUserPassword = async (id) =>
  unwrap(await client.mutations.resetUserPassword({ id }));
