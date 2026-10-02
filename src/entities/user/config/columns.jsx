import { Tag } from "antd";

export const ROLE_LABELS = { ADMIN: "Admin", TEACHER: "Teacher" };

// Cognito user statuses, in the words an admin would use.
const STATUS_LABELS = {
  FORCE_CHANGE_PASSWORD: ["Invited", "gold"],
  CONFIRMED: ["Active", "green"],
  RESET_REQUIRED: ["Password reset", "gold"],
};

export const columns = [
  {
    title: "Email",
    dataIndex: "email",
    width: 280,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: 120,
    render: (role) =>
      role ? ROLE_LABELS[role] || role : <Tag color="red">No role</Tag>,
  },
  {
    title: "Linked teacher",
    dataIndex: "teacherName",
    width: 200,
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 140,
    render: (status, record) => {
      if (record.enabled === false) {
        return <Tag color="red">Disabled</Tag>;
      }
      const [label, color] = STATUS_LABELS[status] || [status, "default"];
      return <Tag color={color}>{label}</Tag>;
    },
  },
  {
    title: "Created",
    dataIndex: "created",
  },
];
