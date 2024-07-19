import useSWR from "swr";
import { Typography } from "antd";

import { EntityList } from "@/shared/ui";

import { columns } from "../config/columns";
import { getAllTeachersTimetable } from "../api/get-teachers-timetable";
import { generateTimetable } from "../lib/generate-timetable";
import { generateTimetableColumns } from "@/shared/lib/generate-timetable-columns";

function TeachersTimetableList({
  reloadData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setSort,
  selectedTeacher = "",
  periods = [],
}) {
  const { Text } = Typography;

  const { data, isLoading } = useSWR(
    ["/api/teachers-timetable", selectedTeacher],
    () => getAllTeachersTimetable(selectedTeacher)
  );

  return (
    <EntityList
      isLoading={isLoading}
      columns={generateTimetableColumns(columns, periods)}
      data={generateTimetable(data)}
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
          {selectedTeacher}
        </Text>
      }
    />
  );
}

export default TeachersTimetableList;
