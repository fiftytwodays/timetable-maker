import { useState } from "react";
import { Alert, Button, Dropdown, Modal, Space, Spin, message } from "antd";
import { DownOutlined, UserAddOutlined } from "@ant-design/icons";
import useSWR, { mutate } from "swr";

import { TeachersList as _TeachersList } from "@/entities/teacher";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import {
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/entities/teacher/api/mutate-teacher";
import { formFields } from "@/entities/teacher/config/form-fields";
import { getAllUsers } from "@/entities/user/api/get-users";
import {
  createUser,
  updateUser,
  deleteUser,
} from "@/entities/user/api/mutate-user";
import { RoleTag, StatusTag } from "@/entities/user/config/columns";
import { teacherLoginFormFields } from "@/entities/user/config/form-fields";
import { useManageEntity } from "@/features/manage-entity";
import {
  confirmResetPassword,
  showTemporaryPassword,
} from "@/features/manage-login";
import useCurrentUser from "@/shared/lib/use-current-user";

const confirmRemoveAccess = (user, teacher) =>
  Modal.confirm({
    title: `Remove login access for ${teacher.name}?`,
    content: `The login "${user.username}" is deleted. The teacher, their timetable and checklists are kept.`,
    okText: "Remove access",
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await deleteUser(user.id, user);
        message.success("Login access removed!");
        mutate(() => true);
      } catch (error) {
        message.error(error.message);
      }
    },
  });

function TeachersList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const currentUser = useCurrentUser();
  const { data: users, error: usersError } = useSWR(
    ["/api/users"],
    getAllUsers
  );

  const loginFor = (teacher) =>
    teacher.userId ? users?.find((user) => user.sub === teacher.userId) : null;

  const teachers = useManageEntity({
    entityName: "Teacher",
    fields: formFields,
    getRecords: getAllTeachers,
    createRecord: createTeacher,
    updateRecord: updateTeacher,
    deleteRecord: async (id, teacher) => {
      if (teacher.userId && !users) {
        throw new Error("Logins could not be loaded. Try again.");
      }
      const login = loginFor(teacher);
      if (login && login.sub === currentUser.userId) {
        throw new Error("This is your own login. Ask another admin to do it.");
      }
      await deleteTeacher(id);
      if (login) {
        await deleteUser(login.id);
      }
    },
    getDeleteDescription: (teacher) =>
      teacher.username
        ? `Delete "${teacher.name}" and their login "${teacher.username}"?`
        : `Delete "${teacher.name}"?`,
  });

  const logins = useManageEntity({
    entityName: "Login",
    fields: teacherLoginFormFields,
    createRecord: async (values, { teacherId, name, hasStaleLink }) => {
      // The linked login was deleted elsewhere (e.g. the Cognito console).
      if (hasStaleLink) {
        await updateTeacher(teacherId, { userId: null, username: null });
      }
      const user = await createUser({ ...values, name, teacherId });
      showTemporaryPassword({ ...user, username: user.id });
    },
    updateRecord: updateUser,
    deleteRecord: deleteUser,
    getRecordLabel: (user) => user.username,
  });

  const loginColumn = {
    title: "Login",
    key: "login",
    width: 340,
    render: (_, teacher) => {
      if (!users && !usersError) {
        return <Spin size="small" />;
      }
      const user = loginFor(teacher);
      if (!user) {
        return (
          <Button
            size="small"
            icon={<UserAddOutlined />}
            disabled={Boolean(usersError)}
            onClick={() =>
              logins.openCreate({
                teacherId: teacher.id,
                name: teacher.name,
                hasStaleLink: Boolean(teacher.userId),
              })
            }
          >
            Give login access
          </Button>
        );
      }

      const onMenuClick = ({ key }) => {
        if (key === "edit") {
          logins.openEdit(user);
        } else if (key === "reset") {
          confirmResetPassword(user);
        } else if (key === "remove") {
          confirmRemoveAccess(user, teacher);
        }
      };

      return (
        <Space size="small" wrap>
          <span>{user.username}</span>
          <RoleTag role={user.role} />
          <StatusTag user={user} />
          <Dropdown
            menu={{
              onClick: onMenuClick,
              items: [
                { key: "edit", label: "Edit login" },
                { key: "reset", label: "Reset password" },
                { type: "divider" },
                { key: "remove", label: "Remove access", danger: true },
              ],
            }}
          >
            <Button size="small">
              Manage <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      );
    },
  };

  return (
    <>
      {usersError && (
        <Alert
          type="error"
          showIcon
          message="Could not load logins"
          description={usersError.message}
        />
      )}
      <_TeachersList
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isLoading={false}
        extraColumns={[loginColumn, teachers.actionsColumn]}
        toolbarExtensions={[teachers.addButton]}
      />
      {teachers.formModal}
      {logins.formModal}
    </>
  );
}

export default TeachersList;
