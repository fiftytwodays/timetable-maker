import { FREQUENCY_LABELS } from "./columns";

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
