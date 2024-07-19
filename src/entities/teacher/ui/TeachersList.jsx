import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllTeachers } from "../api/get-teachers";

function TeachersList({
  reloadData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
}) {
  const { data, isLoading } = useSWR(["/api/teachers"], getAllTeachers);

  return (
    <EntityList
      isLoading={isLoading}
      columns={columns}
      data={data}
      reloadData={reloadData}
      rowKey="id"
      totalCount={data?.length}
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      showTableResizeOption
      isPaginationVisible={true}
    />
  );
}

export default TeachersList;
