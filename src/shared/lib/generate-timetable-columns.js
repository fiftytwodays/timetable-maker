import { Flex, Typography } from "antd";

const { Text } = Typography;

function getDurationByPeriodName(periods, periodName) {
  const period = periods.find((period) => period.name === periodName);
  return period ? period.duration : null;
}

export function generateTimetableColumns({
  columns,
  periods,
  selectedClass,
  isEditable,
  handleSave = () => {},
  logoURL,
}) {
  const periodNames = periods.map((period) => period?.name);
  return columns
    .filter(
      (column) =>
        periodNames.includes(column?.title) ||
        column?.key === "day" ||
        column?.key === "break"
    )
    .map((column) => {
      const { key, title } = column;

      if (column?.isLogoVisible) {
        return { ...column, logoURL: logoURL };
      }

      const duration = getDurationByPeriodName(periods, title);
      const cellProps = isEditable
        ? {
            onCell: (record) => ({
              record,
              editable: isEditable,
              period: key,
              selectedClass: selectedClass,
              handleSave: handleSave,
            }),
          }
        : {};

      return {
        ...column,
        ...cellProps,
        title: (
          <Flex gap="small" vertical>
            <Text>{title}</Text>
            <Text style={{ fontSize: "14px" }}>{duration}</Text>
          </Flex>
        ),
      };
    });
}
