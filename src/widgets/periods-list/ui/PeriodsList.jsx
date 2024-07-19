import { useState } from "react";

import { PeriodsList as _PeriodsList } from "@/entities/periods";

function PeriodsList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return (
    <_PeriodsList
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={false}
    />
  );
}

export default PeriodsList;
