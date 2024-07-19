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
    title: "Association",
    dataIndex: ["expand", "class_sub_teach_ass", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Day",
    dataIndex: ["expand", "day", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
  {
    title: "Period",
    dataIndex: ["expand", "period", "name"],
    width: 300,
    hidden: false,
    sorter: true,
  },
];
