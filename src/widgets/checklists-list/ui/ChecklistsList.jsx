import { useState } from "react";
import useSWR from "swr";

import { ChecklistsList as _ChecklistsList } from "@/entities/checklist";
import { getAllChecklists } from "@/entities/checklist/api/get-checklists";
import {
  createChecklist,
  updateChecklist,
  deleteChecklist,
} from "@/entities/checklist/api/mutate-checklist";
import { getFormFields } from "@/entities/checklist/config/form-fields";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { useManageEntity } from "@/features/manage-entity";

function ChecklistsList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data: teachers } = useSWR(["/api/teachers"], getAllTeachers);

  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Checklist",
    fields: getFormFields({ teachers }),
    getRecords: getAllChecklists,
    createRecord: createChecklist,
    updateRecord: updateChecklist,
    deleteRecord: deleteChecklist,
    getRecordLabel: (checklist) => checklist.title,
  });

  return (
    <>
      <_ChecklistsList
        pageNo={pageNo}
        setPageNo={setPageNo}
        pageSize={pageSize}
        setPageSize={setPageSize}
        extraColumns={[actionsColumn]}
        toolbarExtensions={[addButton]}
      />
      {formModal}
    </>
  );
}

export default ChecklistsList;
