import { useState } from "react";

import { TeachersList as _TeachersList } from "@/entities/teacher";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import {
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "@/entities/teacher/api/mutate-teacher";
import { formFields } from "@/entities/teacher/config/form-fields";
import { useManageEntity } from "@/features/manage-entity";

function TeachersList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Teacher",
    fields: formFields,
    getRecords: getAllTeachers,
    createRecord: createTeacher,
    updateRecord: updateTeacher,
    deleteRecord: deleteTeacher,
  });

  return (
    <>
      <_TeachersList
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

export default TeachersList;
