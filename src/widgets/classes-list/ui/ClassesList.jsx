import { useState } from "react";

import { ClassesList as _ClassesList } from "@/entities/class";

function ClassesList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return (
    <_ClassesList
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={false}
    />
  );
}

export default ClassesList;
