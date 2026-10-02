import { useState } from "react";

import { SubjectsList as _SubjectsList } from "@/entities/subject";
import { getAllSubjects } from "@/entities/subject/api/get-subjects";
import {
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/entities/subject/api/mutate-subject";
import { formFields } from "@/entities/subject/config/form-fields";
import { useManageEntity } from "@/features/manage-entity";

function SubjectsList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Subject",
    fields: formFields,
    getRecords: () => getAllSubjects(),
    createRecord: createSubject,
    updateRecord: updateSubject,
    deleteRecord: deleteSubject,
  });

  return (
    <>
      <_SubjectsList
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isLoading={false}
        extraColumns={[actionsColumn]}
        toolbarExtensions={[addButton]}
      />
      {formModal}
    </>
  );
}

export default SubjectsList;
