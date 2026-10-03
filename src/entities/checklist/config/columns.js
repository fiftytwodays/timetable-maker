import { describeLateDays } from "@/entities/school/lib/describe-late-days";

export const FREQUENCY_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  ONCE: "One-time",
};

export const LATE_LIMIT_LABELS = {
  SCHOOL_DEFAULT: "School default",
  CUSTOM: "Custom",
  NO_LIMIT: "No limit",
};

const describeLateLimit = ({ lateLimit, lateDays }) =>
  lateLimit === "CUSTOM"
    ? describeLateDays(lateDays)
    : LATE_LIMIT_LABELS[lateLimit] || LATE_LIMIT_LABELS.SCHOOL_DEFAULT;

export const columns = [
  {
    title: "Title",
    dataIndex: "title",
    width: 250,
  },
  {
    title: "Frequency",
    dataIndex: "frequency",
    width: 120,
    render: (frequency) => FREQUENCY_LABELS[frequency] || "---",
  },
  {
    title: "Activities",
    dataIndex: "itemCount",
    width: 110,
    render: (count) => count ?? 0,
  },
  {
    title: "Fill in past days",
    key: "lateLimit",
    width: 190,
    render: (_, checklist) => describeLateLimit(checklist),
  },
  {
    title: "Assigned to",
    dataIndex: "teacherNames",
    width: 300,
  },
  {
    title: "Updated",
    dataIndex: "updated",
  },
];
