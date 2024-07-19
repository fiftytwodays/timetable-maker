import { useState } from "react";
import useSWR from "swr";

import { getAllTeachers } from "@/entities/teacher/api/get-teachers";

export default function useTeachers(defaultTeacher) {
  const [selectedTeacher, setSelectedTeacher] = useState(defaultTeacher);
  const { data: teachers } = useSWR("/api/teachers", getAllTeachers);

  const onSelectedTeacherChange = (value) => {
    setSelectedTeacher(value);
  };

  const teachersList = [
    { label: "All", value: "all" },
    ...(teachers?.map((item) => ({
      label: item?.name,
      value: item?.name,
    })) || []),
  ];

  return {
    selectedTeacher: selectedTeacher,
    onSelectedTeacherChange: onSelectedTeacherChange,
    teachersList: teachersList,
  };
}
