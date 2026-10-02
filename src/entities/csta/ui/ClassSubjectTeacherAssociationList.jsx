import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllClassSubjectTeacherAssociation } from "../api/get-all-csta";

function ClassSubjectTeacherAssociationList({
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data: tableData, isLoading: isTableLoading } = useSWR(
    ["/api/csta-list"],
    getAllClassSubjectTeacherAssociation
  );

  return (
    <div>
      <EntityList
        isLoading={isTableLoading}
        columns={[...columns, ...extraColumns]}
        data={tableData}
        rowKey="id"
        totalCount={tableData?.length}
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isPaginationVisible={true}
        showToolbar={toolbarExtensions.length > 0}
        toolbarExtensions={toolbarExtensions}
      />
    </div>
  );
}

export default ClassSubjectTeacherAssociationList;
