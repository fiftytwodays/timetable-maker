import { ROLE_LABELS } from "./columns";

export const getFormFields = ({ teachers = [] }) => [
  {
    name: "email",
    label: "Email",
    required: true,
    disabledOnEdit: true,
    placeholder: "teacher@school.com",
    extra: "An invitation with a temporary password is sent to this address.",
    rules: [{ type: "email", message: "Please enter a valid email address" }],
  },
  {
    name: "name",
    label: "Name",
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    initialValue: "TEACHER",
    options: Object.entries(ROLE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    name: "teacherId",
    label: "Linked teacher",
    type: "select",
    placeholder: "Select the teacher this login belongs to",
    extra:
      "Lets this user see their own timetable and checklists. Admins can be linked too.",
    options: teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.email ? `${teacher.name} (${teacher.email})` : teacher.name,
    })),
  },
  {
    name: "enabled",
    label: "Status",
    type: "select",
    required: true,
    hiddenOnCreate: true,
    extra: "Disabled users cannot sign in.",
    options: [
      { value: true, label: "Enabled" },
      { value: false, label: "Disabled" },
    ],
  },
];
