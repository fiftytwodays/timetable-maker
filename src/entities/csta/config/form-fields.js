const toOptions = (records = []) =>
  records.map((record) => ({ value: record.id, label: record.name }));

export const getFormFields = ({ classes, subjects, teachers }) => [
  {
    name: "classId",
    label: "Class",
    type: "select",
    required: true,
    placeholder: "Select a class",
    options: toOptions(classes),
  },
  {
    name: "subjectId",
    label: "Subject",
    type: "select",
    required: true,
    placeholder: "Select a subject",
    options: toOptions(subjects),
  },
  {
    name: "teacherId",
    label: "Teacher",
    type: "select",
    required: true,
    placeholder: "Select a teacher",
    options: toOptions(teachers),
  },
];
