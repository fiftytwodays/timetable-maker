import useSWR from "swr";
import { Typography } from "antd";

import { EntityList } from "@/shared/ui";

import { columns } from "../config/columns";
import { getAllStudentsTimetable } from "../api/get-students-timetable";
import { generateTimetable } from "../lib/generate-timetable";
import { generateTimetableColumns } from "@/shared/lib/generate-timetable-columns";

function StudentsTimetableList({
  reloadData,
  isLoading,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setSort,
  selectedClass = "",
  periods = [],
  logoURL = "",
}) {
  const { Text } = Typography;

  const { data, isStudentesTimetableLoading } = useSWR(
    ["/api/students-timetable", selectedClass],
    () => getAllStudentsTimetable(selectedClass)
  );

  const tableData = generateTimetable(data);

  return (
    <EntityList
      isLoading={isLoading || isStudentesTimetableLoading}
      columns={generateTimetableColumns({
        columns,
        periods,
        rowCount: tableData.length,
        logoURL,
      })}
      data={tableData}
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
        <div style={{ textAlign: "center" }}>
          <Text style={{ fontSize: "24px" }} strong>
            {selectedClass}
          </Text>
        </div>
      }
    />
  );
}

export default StudentsTimetableList;
