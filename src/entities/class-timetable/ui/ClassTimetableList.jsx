import useSWR, { mutate } from "swr";
import { Typography, message } from "antd";

import { EntityList } from "@/shared/ui";

import { columns } from "../config/columns";
import { getAllClassTimetable } from "../api/get-all-class-timetable";
import { generateTimetable } from "../lib/generate-timetable";
import { generateTimetableColumns } from "@/shared/lib/generate-timetable-columns";
import { EditableCell } from "./EditableCell";
import { createClassTimetable } from "../api/create-class-timetable";
import { updateClassTimetable } from "../api/update-class-timetable";
import { deleteClassTimetable } from "../api/delete-class-timetable";
import { checkForCtaConflict } from "../lib/check-cta-conflit";

function ClassTimetableList({
  reloadData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setSort,
  selectedClass = "",
  periods = [],
  days = [],
  isEditable = false,
}) {
  const { Text } = Typography;

  const getPeriodId = (periods, periodName) => {
    return periods.find((period) => period?.name === periodName)?.id;
  };

  const getDayId = (days, dayName) => {
    return days.find((day) => day?.name === dayName)?.id;
  };

  const { data, isLoading } = useSWR(
    ["/api/class-timetable", selectedClass],
    () => getAllClassTimetable(selectedClass)
  );

  const showMessage = (type = "info", content = "") => {
    message.open({
      type: type,
      content: content,
    });
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const handleSave = async (cstaId, period, day, record) => {
    const periodId = getPeriodId(periods, period);
    const dayId = getDayId(days, day);
    const ctaId = record[period]?.[2];

    try {
      if (cstaId === "reset") {
        // Handle the reset case
        if (ctaId) {
          const result = await deleteClassTimetable(ctaId);
          if (result) {
            showMessage("success", "Record deleted successfully!");
            mutate(["/api/class-timetable", selectedClass]);
          }
        } else {
          showMessage("info", "No record to reset.");
        }
        return; // Exit after handling the reset case
      }

      // Check for conflicts
      const { isUnique, description } = await checkForCtaConflict(
        cstaId,
        dayId,
        periodId
      );
      if (!isUnique) {
        showMessage("warning", description);
        return;
      }

      // Determine if we need to update or create
      const saveResult = ctaId
        ? await updateClassTimetable(ctaId, cstaId, dayId, periodId)
        : await createClassTimetable(cstaId, dayId, periodId);

      if (saveResult?.id) {
        const message = ctaId
          ? "Record updated successfully!"
          : "Record created successfully!";
        showMessage("success", message);
        mutate(["/api/class-timetable", selectedClass]);
      }
    } catch (errInfo) {
      console.error("Save failed:", errInfo);
    }
  };

  return (
    <EntityList
      isLoading={isLoading}
      columns={generateTimetableColumns(
        columns,
        periods,
        selectedClass,
        isEditable,
        handleSave
      )}
      data={generateTimetable(data, days, periods)}
      reloadData={reloadData}
      rowKey="key"
      totalCount={data?.length || 0}
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      showTableResizeOption
      setSort={setSort}
      isBordered={true}
      showToolbar
      title={
        <Text style={{ fontSize: "24px" }} strong>
          {selectedClass}
        </Text>
      }
      isEditable={isEditable}
      components={isEditable && components}
    />
  );
}

export default ClassTimetableList;
