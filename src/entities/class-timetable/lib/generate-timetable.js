export const generateTimetable = (apiResponse) => {
  if (!apiResponse) {
    return [];
  }

  let data = {
    Monday: { day: "Monday", key: "1" },
    Tuesday: { day: "Tuesday", key: "2" },
    Wednesday: { day: "Wednesday", key: "3" },
    Thursday: { day: "Thursday", key: "4" },
    Friday: { day: "Friday", key: "5" },
    Saturday: { day: "Saturday", key: "6" },
  };
  apiResponse.forEach((item) => {
    const dayName = item?.expand?.day?.name;
    const periodName = item?.expand?.period?.name;
    const classInfo =
      item?.expand?.class_sub_teach_ass?.expand?.subject_name?.name;

    const teacherName =
      item?.expand?.class_sub_teach_ass?.expand?.teacher_name?.name;

    if (!data[dayName]) {
      data[dayName] = { day: dayName };
    }

    data[dayName][periodName] = [classInfo, teacherName];
  });

  const tableData = Object.values(data);

  return [...tableData];
};
