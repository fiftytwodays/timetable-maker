import useSWR from "swr";
import { useState } from "react";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllPeriods } from "../api/get-periods";

function PeriodsList({ reloadData, pageNo, setPageNo, pageSize, setPageSize }) {
  const [sort, setSort] = useState();
  const { data, isLoading } = useSWR([sort, "/api/periods"], () =>
    getAllPeriods(sort)
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

export default PeriodsList;
