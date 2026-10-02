import { client, unwrap } from "@/shared/lib/amplify";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { updateTeacher } from "@/entities/teacher/api/mutate-teacher";

const assertTeacherAvailable = async (teacherId, user) => {
  if (!teacherId) {
    return;
  }
  const teachers = await getAllTeachers();
  const teacher = teachers.find((teacher) => teacher.id === teacherId);
  if (teacher?.userId && teacher.userId !== user?.sub) {
    throw new Error(
      `${teacher.name} already has the login "${teacher.username}".`
    );
  }
};

const linkTeacher = (teacherId, user) =>
  teacherId &&
  updateTeacher(teacherId, { userId: user.sub, username: user.id });

const unlinkTeacher = (teacherId) =>
  teacherId && updateTeacher(teacherId, { userId: null, username: null });

/**
 * Creates a login. The result includes `temporaryPassword`, which is only
 * available now and must be shown to the admin.
 */
export const createUser = async ({
  username,
  email,
  name,
  role,
  teacherId,
}) => {
  await assertTeacherAvailable(teacherId);
  const user = unwrap(
    await client.mutations.createUser({
      username,
      email: email || null,
      name: name || null,
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
 * `values` has a `teacherId` key.
 */
export const updateUser = async (id, values, record) => {
  const { email, name, role, enabled } = values;
  const changesTeacher = "teacherId" in values;
  const teacherId = values.teacherId ?? null;
  if (changesTeacher) {
    await assertTeacherAvailable(teacherId, record);
  }

  const user = unwrap(
    await client.mutations.updateUser({
      id,
      role,
      enabled,
      ...(isChanged(values, record, "email") && { email: email || "" }),
      ...(isChanged(values, record, "name") && { name: name || "" }),
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
