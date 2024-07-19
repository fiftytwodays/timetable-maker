import { useState } from "react";

import { ClassSubjectTeacherAssociationList as _ClassSubjectTeacherAssociationList } from "@/entities/csta";

function ClassSubjectTeacherAssociationList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return (
    <_ClassSubjectTeacherAssociationList
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={false}
    />
  );
}

export default ClassSubjectTeacherAssociationList;
