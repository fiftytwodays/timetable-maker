import useSWR from "swr";
import { useState } from "react";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllSubjects } from "../api/get-subjects";

function SubjectsList({
  reloadData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
}) {
  const [sort, setSort] = useState("");
  const { data, isLoading } = useSWR([sort, "/api/subjects"], () =>
    getAllSubjects(sort)
  );

  return (
    <div>
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
        setSort={setSort}
        showTableResizeOption
        isPaginationVisible={true}
      />
    </div>
  );
}

export default SubjectsList;
