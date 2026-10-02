import { client, unwrap } from "@/shared/lib/amplify";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";

/**
 * Lists the Cognito users with their role and the teacher they are linked
 * to (the Teacher record whose `userId` is the user's sub). A linked user's
 * name is the teacher's name; `loginName` is the name stored in Cognito.
 */
export const getAllUsers = async () => {
  const [users, teachers] = await Promise.all([
    client.queries.listUsers().then(unwrap),
    getAllTeachers(),
  ]);

  return users
    .filter(Boolean)
    .map((user) => {
      const teacher = teachers.find(
        (teacher) => teacher.userId && teacher.userId === user.sub
      );
      return {
        ...user,
        name: teacher?.name ?? user.name,
        loginName: user.name,
        username: user.id,
        created: user.createdAt,
        teacherId: teacher?.id ?? null,
        teacherName: teacher?.name ?? null,
      };
    })
    .sort((a, b) => a.username.localeCompare(b.username));
};
