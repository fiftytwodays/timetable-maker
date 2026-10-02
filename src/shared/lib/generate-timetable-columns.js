import { Flex, Typography } from "antd";

import { formatTimeRange } from "./format-time";

const { Text } = Typography;

const ColumnTitle = ({ title, time }) => (
  <Flex gap="small" vertical>
    <Text>{title}</Text>
    {time && <Text style={{ fontSize: "14px" }}>{time}</Text>}
  </Flex>
);

/**
 * Builds the timetable columns: the leading `columns` (the day column), then
 * one column per period in the order given. Lessons are keyed by period id;
 * a break spans every row and shows its name.
 */
export function generateTimetableColumns({
  columns,
  periods = [],
  rowCount = 0,
  selectedClass,
  isEditable,
  handleSave = () => {},
  logoURL,
}) {
  const leadingColumns = columns.map((column) =>
    column?.isLogoVisible ? { ...column, logoURL } : column
  );

  const periodColumns = periods.map((period) => {
    const time = formatTimeRange(period.startTime, period.endTime);

    if (period.type === "BREAK") {
      return {
        key: period.id,
        dataIndex: period.id,
        title: time && <Text style={{ fontSize: "14px" }}>{time}</Text>,
        width: 100,
        align: "center",
        type: "break",
        breakLabel: period.name,
        onCell: (_, index) => ({ rowSpan: index === 0 ? rowCount : 0 }),
      };
    }

    return {
      key: period.id,
      dataIndex: period.id,
      title: <ColumnTitle title={period.name} time={time} />,
      align: "center",
      dataType: "array",
      type: "period",
      ...(isEditable && {
        onCell: (record) => ({
          record,
          editable: isEditable,
          period: period.id,
          selectedClass,
          handleSave,
        }),
      }),
    };
  });

  return [...leadingColumns, ...periodColumns];
}
