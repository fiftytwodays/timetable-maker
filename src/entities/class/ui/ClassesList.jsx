import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllClasses } from "../api/get-classes";

function ClassesList({
  reloadData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data, isLoading } = useSWR(["/api/classes"], getAllClasses);
  return (
    <div>
      <EntityList
        isLoading={isLoading}
        columns={[...columns, ...extraColumns]}
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
        showToolbar={toolbarExtensions.length > 0}
        toolbarExtensions={toolbarExtensions}
      />
    </div>
  );
}

export default ClassesList;
