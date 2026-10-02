import { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import useSWR from "swr";

import { UsersList as _UsersList } from "@/entities/user";
import {
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "@/entities/user/api/mutate-user";
import { getFormFields } from "@/entities/user/config/form-fields";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { useManageEntity } from "@/features/manage-entity";

function ResetPasswordButton({ user }) {
  const isInvited = user.status === "FORCE_CHANGE_PASSWORD";

  const onConfirm = async () => {
    try {
      await resetUserPassword(user.id);
      message.success(
        isInvited
          ? `Invitation sent again to ${user.email}`
          : `Password reset code sent to ${user.email}`
      );
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Popconfirm
      title={isInvited ? "Resend invitation" : "Reset password"}
      description={
        isInvited
          ? `Email a new temporary password to ${user.email}?`
          : `Email a password reset code to ${user.email}? They must set a new password at next sign-in.`
      }
      okText="Send"
      onConfirm={onConfirm}
    >
      <Button size="small" icon={<MailOutlined />}>
        {isInvited ? "Resend invite" : "Reset password"}
      </Button>
    </Popconfirm>
  );
}

function UsersList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: teachers } = useSWR(["/api/teachers"], getAllTeachers);

  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "User",
    fields: getFormFields({ teachers }),
    createRecord: createUser,
    updateRecord: updateUser,
    deleteRecord: deleteUser,
    getRecordLabel: (user) => user.email,
    extraActions: (user) => <ResetPasswordButton user={user} />,
  });

  return (
    <>
      <_UsersList
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        extraColumns={[actionsColumn]}
        toolbarExtensions={[addButton]}
      />
      {formModal}
    </>
  );
}

export default UsersList;
