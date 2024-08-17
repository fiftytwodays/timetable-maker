import { useState, useCallback, useMemo } from "react";
import { Select, Typography } from "antd";
import useSWR from "swr";

import { getAllClassSubjectTeacherAssociation } from "@/entities/csta/api/get-all-csta";

const { Text } = Typography;

export const EditableCell = ({
  editable,
  children,
  period,
  selectedClass,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  const { data } = useSWR(
    ["/api/class-timetable-csta"],
    getAllClassSubjectTeacherAssociation
  );

  const generateSelectOptions = useCallback(
    (data) => {
      const options = data
        ?.filter((item) => item?.expand?.class_name?.name === selectedClass)
        ?.map((item) => {
          return {
            key: `${item?.teacher_name}-${item?.subject_name}`,
            value: item?.id,
            label: `${item?.expand?.teacher_name?.name} - ${item?.expand?.subject_name?.name}`,
          };
        });
      if (options) {
        return [
          {
            key: "reset",
            value: "reset",
            label: <Text type="danger">Unset</Text>,
          },
          ...options,
        ];
      }
      return [];
    },
    [selectedClass]
  );

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = (cstaId) => {
    handleSave(cstaId, period, record?.day, record);

    toggleEdit();
  };

  let childNode = children;

  const selectOptions = useMemo(
    () => generateSelectOptions(data),
    [data, generateSelectOptions]
  );

  if (editable) {
    childNode = editing ? (
      <>
        <Select
          showSearch
          defaultOpen
          autoFocus
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          popupMatchSelectWidth={false}
          onChange={save}
          onBlur={toggleEdit}
          onDropdownVisibleChange={(isOpen) => {
            setEditing(isOpen);
          }}
          options={selectOptions}
          placeholder="Search CTA relation.."
        />
      </>
    ) : (
      <div
        onClick={() => {
          toggleEdit();
        }}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
