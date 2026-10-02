import { Tag, Typography } from "antd";

export const ROLE_LABELS = { ADMIN: "Admin", TEACHER: "Teacher" };

// Cognito user statuses, in the words an admin would use.
const STATUS_LABELS = {
  FORCE_CHANGE_PASSWORD: ["Temporary password", "gold"],
  CONFIRMED: ["Active", "green"],
  RESET_REQUIRED: ["Password reset", "gold"],
};

export const RoleTag = ({ role }) =>
  role ? (
    <Tag color={role === "ADMIN" ? "blue" : "default"}>
      {ROLE_LABELS[role] || role}
    </Tag>
  ) : (
    <Tag color="red">No role</Tag>
  );

export const StatusTag = ({ user }) => {
  if (user.enabled === false) {
    return <Tag color="red">Disabled</Tag>;
  }
  const [label, color] = STATUS_LABELS[user.status] || [user.status, "default"];
  return <Tag color={color}>{label}</Tag>;
};

export const columns = [
  {
    title: "Username",
    dataIndex: "username",
    width: 180,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 180,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 240,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: 110,
    render: (role) => <RoleTag role={role} />,
  },
  {
    title: "Linked teacher",
    dataIndex: "teacherName",
    width: 180,
    render: (teacherName) =>
      teacherName || (
        <Typography.Text type="secondary">Not a teacher</Typography.Text>
      ),
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 160,
    render: (_, user) => <StatusTag user={user} />,
  },
  {
    title: "Created",
    dataIndex: "created",
  },
];
