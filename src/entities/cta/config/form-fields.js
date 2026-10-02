const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const toOptions = (records = []) =>
  records.map((record) => ({ value: record.id, label: record.name }));

const byWeekday = (a, b) =>
  WEEKDAYS.indexOf(a?.name) - WEEKDAYS.indexOf(b?.name);

export const getFormFields = ({ associations, days, periods = [] }) => [
  {
    name: "cstaId",
    label: "Association",
    type: "select",
    required: true,
    placeholder: "Select a class - subject - teacher",
    options: toOptions(associations),
  },
  {
    name: "dayId",
    label: "Day",
    type: "select",
    required: true,
    placeholder: "Select a day",
    options: toOptions([...(days || [])].sort(byWeekday)),
  },
  {
    name: "periodId",
    label: "Period",
    type: "select",
    required: true,
    placeholder: "Select a period",
    // Breaks cannot hold lessons.
    options: toOptions(periods.filter((period) => period.type !== "BREAK")),
  },
];

export const getRecordLabel = (record) =>
  [
    record?.expand?.class_sub_teach_ass?.name,
    record?.expand?.day?.name,
    record?.expand?.period?.name,
  ]
    .filter(Boolean)
    .join(", ");
