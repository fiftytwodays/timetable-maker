import { FREQUENCY_LABELS, LATE_LIMIT_LABELS } from "./columns";

export const getFormFields = ({ teachers = [] }) => [
  {
    name: "title",
    label: "Title",
    required: true,
    unique: true,
    placeholder: "Morning duties",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
  {
    name: "frequency",
    label: "Frequency",
    type: "select",
    required: true,
    initialValue: "DAILY",
    extra: "How often teachers complete this checklist.",
    options: Object.entries(FREQUENCY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "lateLimit",
    label: "Fill in past days",
    type: "select",
    required: true,
    initialValue: "SCHOOL_DEFAULT",
    extra:
      "How far back teachers can fill in this checklist. The school default is set on the School page.",
    options: Object.entries(LATE_LIMIT_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "lateDays",
    label: "Days back",
    type: "number",
    min: 0,
    required: true,
    extra: "0 allows only today or this week.",
    hiddenWhen: (values) => values.lateLimit !== "CUSTOM",
  },
  {
    name: "items",
    label: "Activities",
    type: "list",
    itemLabel: "activity",
    placeholder: "Check attendance register",
  },
  {
    name: "teacherIds",
    label: "Assigned teachers",
    type: "select",
    mode: "multiple",
    placeholder: "Select teachers",
    options: teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.name,
    })),
  },
];
