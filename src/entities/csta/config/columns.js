export const columns = [
  {
    title: "Id",
    dataIndex: "id",
    width: 100,
    hidden: false,
    sorter: true,
    link: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Class Name",
    dataIndex: ["expand", "class_name", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Teacher Name",
    dataIndex: ["expand", "teacher_name", "name"],

    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Subject Name",
    dataIndex: ["expand", "subject_name", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
];
