import { useState } from "react";

import { TeachersList as _TeachersList } from "@/entities/teacher";

function TeachersList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  return (
    <_TeachersList
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isLoading={false}
    />
  );
}

export default TeachersList;
