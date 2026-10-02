import { useState } from "react";
import useSWR from "swr";

import { ClassSubjectTeacherAssociationList as _ClassSubjectTeacherAssociationList } from "@/entities/csta";
import {
  createClassSubjectTeacherAssociation,
  updateClassSubjectTeacherAssociation,
  deleteClassSubjectTeacherAssociation,
} from "@/entities/csta/api/mutate-csta";
import { getFormFields } from "@/entities/csta/config/form-fields";
import { getAllClasses } from "@/entities/class/api/get-classes";
import { getAllSubjects } from "@/entities/subject/api/get-subjects";
import { getAllTeachers } from "@/entities/teacher/api/get-teachers";
import { useManageEntity } from "@/features/manage-entity";

function ClassSubjectTeacherAssociationList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: classes } = useSWR(["/api/classes"], getAllClasses);
  const { data: subjects } = useSWR(["/api/subjects", "options"], () =>
    getAllSubjects()
  );
  const { data: teachers } = useSWR(["/api/teachers"], getAllTeachers);

  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Association",
    fields: getFormFields({ classes, subjects, teachers }),
    createRecord: createClassSubjectTeacherAssociation,
    updateRecord: updateClassSubjectTeacherAssociation,
    deleteRecord: deleteClassSubjectTeacherAssociation,
  });

  return (
    <>
      <_ClassSubjectTeacherAssociationList
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

export default ClassSubjectTeacherAssociationList;
