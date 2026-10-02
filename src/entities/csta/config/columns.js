export const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Class name",
    dataIndex: ["expand", "class_name", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Teacher name",
    dataIndex: ["expand", "teacher_name", "name"],

    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Subject name",
    dataIndex: ["expand", "subject_name", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
];
