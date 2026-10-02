import { useState } from "react";

import { ClassesList as _ClassesList } from "@/entities/class";
import { getAllClasses } from "@/entities/class/api/get-classes";
import {
  createClass,
  updateClass,
  deleteClass,
} from "@/entities/class/api/mutate-class";
import { formFields } from "@/entities/class/config/form-fields";
import { useManageEntity } from "@/features/manage-entity";

function ClassesList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Class",
    fields: formFields,
    getRecords: getAllClasses,
    createRecord: createClass,
    updateRecord: updateClass,
    deleteRecord: deleteClass,
  });

  return (
    <>
      <_ClassesList
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

export default ClassesList;
