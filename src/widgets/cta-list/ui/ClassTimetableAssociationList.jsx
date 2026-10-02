import { useState } from "react";
import useSWR from "swr";

import { ClassTimetableAssociationList as _ClassTimetableAssociationList } from "@/entities/cta";
import {
  createClassTimetableAssociation,
  updateClassTimetableAssociation,
  deleteClassTimetableAssociation,
} from "@/entities/cta/api/mutate-cta";
import {
  getFormFields,
  getRecordLabel,
} from "@/entities/cta/config/form-fields";
import { getAllClassSubjectTeacherAssociation } from "@/entities/csta/api/get-all-csta";
import { getAllDays } from "@/entities/days/api/get-days";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { useManageEntity } from "@/features/manage-entity";

function ClassTimetableAssociationList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: associations } = useSWR(
    ["/api/csta-list"],
    getAllClassSubjectTeacherAssociation
  );
  const { data: days } = useSWR(["/api/days"], getAllDays);
  const { data: periods } = useSWR(["/api/periods"], () => getAllPeriods());

  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Timetable entry",
    fields: getFormFields({ associations, days, periods }),
    createRecord: createClassTimetableAssociation,
    updateRecord: updateClassTimetableAssociation,
    deleteRecord: deleteClassTimetableAssociation,
    getRecordLabel,
  });

  return (
    <>
      <_ClassTimetableAssociationList
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

export default ClassTimetableAssociationList;
