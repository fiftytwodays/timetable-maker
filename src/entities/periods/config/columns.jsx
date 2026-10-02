import { Tag } from "antd";

import { formatTimeRange } from "@/shared/lib/format-time";

export const PERIOD_TYPE_LABELS = { LESSON: "Lesson", BREAK: "Break" };

export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 250,
    hidden: false,
    sorter: true,
  },
  {
    title: "Type",
    dataIndex: "type",
    width: 120,
    hidden: false,
    render: (type) =>
      type === "BREAK" ? (
        <Tag color="orange">Break</Tag>
      ) : (
        <Tag>Lesson</Tag>
      ),
  },
  {
    title: "Time",
    dataIndex: "startTime",
    width: 250,
    hidden: false,
    sorter: true,
    render: (_, period) =>
      formatTimeRange(period.startTime, period.endTime) || "---",
  },
  {
    title: "Created",
    dataIndex: "created",
    hidden: false,
    sorter: true,
  },
  {
    title: "Updated",
    dataIndex: "updated",
    hidden: false,
    sorter: true,
  },
];
