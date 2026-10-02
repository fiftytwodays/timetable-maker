import { useState } from "react";

import { PeriodsList as _PeriodsList } from "@/entities/periods";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import {
  createPeriod,
  updatePeriod,
  deletePeriod,
} from "@/entities/periods/api/mutate-period";
import { formFields } from "@/entities/periods/config/form-fields";
import { useManageEntity } from "@/features/manage-entity";

function PeriodsList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { addButton, actionsColumn, formModal } = useManageEntity({
    entityName: "Period",
    fields: formFields,
    getRecords: () => getAllPeriods(),
    createRecord: createPeriod,
    updateRecord: updatePeriod,
    deleteRecord: deletePeriod,
  });

  return (
    <>
      <_PeriodsList
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

export default PeriodsList;
