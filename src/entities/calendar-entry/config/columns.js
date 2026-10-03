import { Tag } from "antd";
import dayjs from "dayjs";

export const TYPE_LABELS = {
  HOLIDAY: "Holiday",
  WORKING_DAY: "Extra working day",
};

export const TYPE_COLORS = {
  HOLIDAY: "red",
  WORKING_DAY: "green",
};

export const TypeTag = ({ type }) => (
  <Tag color={TYPE_COLORS[type]}>{TYPE_LABELS[type] || type}</Tag>
);

// "8 Nov 2026", or "8 Nov 2026 – 10 Nov 2026" for a range.
export const formatDateRange = ({ startDate, endDate }) => {
  const start = dayjs(startDate).format("D MMM YYYY");
  return endDate && endDate !== startDate
    ? `${start} – ${dayjs(endDate).format("D MMM YYYY")}`
    : start;
};

export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 250,
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 170,
    render: (type) => <TypeTag type={type} />,
  },
  {
    title: "Dates",
    key: "dates",
    width: 260,
    render: (_, entry) => formatDateRange(entry),
  },
  {
    title: "Days",
    key: "days",
    width: 80,
    render: (_, entry) =>
      dayjs(entry.endDate).diff(dayjs(entry.startDate), "day") + 1,
  },
];
