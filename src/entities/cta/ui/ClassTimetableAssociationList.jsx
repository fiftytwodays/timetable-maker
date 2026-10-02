import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllClassTimetableAssociation } from "../api/get-all-cta";

function ClassTimetableAssociationList({
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data: tableData, isLoading: isTableLoading } = useSWR(
    ["/api/cta-list"],
    getAllClassTimetableAssociation
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

export default ClassTimetableAssociationList;
