import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllChecklists } from "../api/get-checklists";

function ChecklistsList({
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data, isLoading } = useSWR(["/api/checklists"], getAllChecklists);

  return (
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
  );
}

export default ChecklistsList;
