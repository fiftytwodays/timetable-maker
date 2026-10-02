import { useState } from "react";
import { Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import useSWR from "swr";

import { UsersList as _UsersList } from "@/entities/user";
import {
  createUser,
  updateUser,
  deleteUser,
} from "@/entities/user/api/mutate-user";
import { getFormFields } from "@/entities/user/config/form-fields";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { useManageEntity } from "@/features/manage-entity";
import {
  confirmResetPassword,
  showTemporaryPassword,
} from "@/features/manage-login";

const createUserAndShowPassword = async (values) => {
  const user = await createUser(values);
  showTemporaryPassword({ ...user, username: user.id });
  return user;
};

function UsersList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: teachers } = useSWR(["/api/teachers"], getAllTeachers);

  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "User",
    fields: getFormFields({ teachers }),
    createRecord: createUserAndShowPassword,
    updateRecord: updateUser,
    deleteRecord: deleteUser,
    getRecordLabel: (user) => user.username,
    getDeleteDescription: (user) =>
      user.teacherName
        ? `Delete the login "${user.username}"? The teacher ${user.teacherName} is kept but can no longer sign in.`
        : `Delete the login "${user.username}"?`,
    extraActions: (user) => (
      <Button
        size="small"
        icon={<KeyOutlined />}
        onClick={() => confirmResetPassword(user)}
      >
        Reset password
      </Button>
    ),
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
