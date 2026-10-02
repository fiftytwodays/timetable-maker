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
    throw new Error(`${teacher.name} is already linked to ${teacher.email}.`);
  }
};

const linkTeacher = (teacherId, user) =>
  teacherId && updateTeacher(teacherId, { userId: user.sub, email: user.email });

const unlinkTeacher = (teacherId) =>
  teacherId && updateTeacher(teacherId, { userId: null, email: null });

export const createUser = async ({ email, name, role, teacherId }) => {
  await assertTeacherAvailable(teacherId);
  const user = unwrap(
    await client.mutations.createUser({ email, name: name || null, role })
  );
  await linkTeacher(teacherId, user);
  return user;
};

export const updateUser = async (id, values, record) => {
  const { name, role, enabled } = values;
  const teacherId = values.teacherId ?? null;
  await assertTeacherAvailable(teacherId, record);

  const user = unwrap(
    await client.mutations.updateUser({ id, name: name ?? "", role, enabled })
  );
  if (teacherId !== record.teacherId) {
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

export const resetUserPassword = async (id) =>
  unwrap(await client.mutations.resetUserPassword({ id }));
