import { Select } from "antd";

export default function SelectTeacher({
  selectedTeacher,
  onSelectedTeacherChange,
  teachersList,
}) {
  return (
    <Select
      defaultValue="all"
      value={selectedTeacher}
      style={{
        width: 120,
      }}
      onChange={onSelectedTeacherChange}
      options={teachersList}
    />
  );
}
