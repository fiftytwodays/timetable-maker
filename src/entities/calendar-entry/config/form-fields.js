import { TYPE_LABELS } from "./columns";

export const formFields = [
  {
    name: "name",
    label: "Name",
    required: true,
    placeholder: "Diwali",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    initialValue: "HOLIDAY",
    extra:
      "A holiday closes the school. An extra working day opens it on a normally-off day, for example a compensatory Saturday.",
    options: Object.entries(TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "startDate",
    label: "Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End date (optional)",
    type: "date",
    extra: "For a range of days. Leave empty for a single day.",
    dependencies: ["startDate"],
    rules: [
      ({ getFieldValue }) => ({
        validator: async (_, value) => {
          const startDate = getFieldValue("startDate");
          if (value && startDate && value < startDate) {
            throw new Error("The end date cannot be before the start date");
          }
        },
      }),
    ],
  },
];
