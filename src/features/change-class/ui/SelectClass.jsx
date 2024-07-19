import { Select } from "antd";

export default function SelectClass({
  selectedClass,
  onSelectedClassChange,
  classList,
}) {
  return (
    <Select
      defaultValue="KG1"
      value={selectedClass}
      style={{
        width: 120,
      }}
      onChange={onSelectedClassChange}
      options={classList}
    />
  );
}

