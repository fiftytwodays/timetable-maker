export const FREQUENCY_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  ONCE: "One-time",
};

export const columns = [
  {
    title: "Title",
    dataIndex: "title",
    width: 250,
  },
  {
    title: "Frequency",
    dataIndex: "frequency",
    width: 120,
    render: (frequency) => FREQUENCY_LABELS[frequency] || "---",
  },
  {
    title: "Activities",
    dataIndex: "itemCount",
    width: 110,
    render: (count) => count ?? 0,
  },
  {
    title: "Assigned to",
    dataIndex: "teacherNames",
    width: 300,
  },
  {
    title: "Updated",
    dataIndex: "updated",
  },
];
