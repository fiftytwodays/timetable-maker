import { useState } from "react";

import { ClassTimetableAssociationList as _ClassTimetableAssociationList } from "@/entities/cta";

function ClassTimetableAssociationList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return (
    <_ClassTimetableAssociationList
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={false}
    />
  );
}

export default ClassTimetableAssociationList;
