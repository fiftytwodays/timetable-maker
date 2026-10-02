import { ROLE_LABELS } from "./columns";

const usernameField = {
  name: "username",
  label: "Username",
  required: true,
  disabledOnEdit: true,
  placeholder: "anitha.r",
  extra: "Used to sign in. Cannot be changed later.",
  rules: [
    {
      pattern: /^[a-zA-Z0-9._-]{3,64}$/,
      message: "Use 3 to 64 letters, numbers, dots, hyphens or underscores",
    },
  ],
};

const emailField = {
  name: "email",
  label: "Email (optional)",
  placeholder: "teacher@school.com",
  extra: "If set, the invitation is emailed and the user can reset their own password.",
  rules: [{ type: "email", message: "Please enter a valid email address" }],
};

const roleField = {
  name: "role",
  label: "Role",
  type: "select",
  required: true,
  initialValue: "TEACHER",
  options: Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
};

const enabledField = {
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
};

/** Fields for the Users page, where a login can be linked to any teacher. */
export const getFormFields = ({ teachers = [] }) => [
  usernameField,
  { name: "name", label: "Name" },
  emailField,
  roleField,
  {
    name: "teacherId",
    label: "Linked teacher",
    type: "select",
    placeholder: "Not a teacher",
    extra:
      "Lets this user see their own timetable and checklists. Admins can be linked too.",
    options: teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.username
        ? `${teacher.name} (${teacher.username})`
        : teacher.name,
    })),
  },
  enabledField,
];

/** Fields for managing a teacher's own login from the Teachers page. */
export const teacherLoginFormFields = [
  usernameField,
  emailField,
  roleField,
  enabledField,
];
