import useSWR from "swr";
import { Alert } from "antd";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllUsers } from "../api/get-users";

function UsersList({
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data, error, isLoading } = useSWR(["/api/users"], getAllUsers);

  return (
    <>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Could not load users"
          description={error.message}
        />
      )}
      <EntityList
        isLoading={isLoading}
        columns={[...columns, ...extraColumns]}
        data={data}
        rowKey="id"
        totalCount={data?.length}
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isPaginationVisible={true}
        showToolbar={toolbarExtensions.length > 0}
        toolbarExtensions={toolbarExtensions}
      />
    </>
  );
}

export default UsersList;
