import { PERIOD_TYPE_LABELS } from "./columns";

export const formFields = [
  {
    name: "name",
    label: "Name",
    required: true,
    unique: true,
    placeholder: "P1 or Lunch break",
    extra: "Shown as the column heading in the timetables.",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    initialValue: "LESSON",
    extra: "Breaks appear in the timetables but cannot hold lessons.",
    options: Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "startTime",
    label: "Start time",
    type: "time",
    required: true,
  },
  {
    name: "endTime",
    label: "End time",
    type: "time",
    required: true,
  },
];
