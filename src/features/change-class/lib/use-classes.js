import { useState } from "react";
import useSWR from "swr";

import { getAllClasses } from "@/entities/class/api/get-classes";

export default function useClasses(defaultClass) {
  const [selectedClass, setSelectedClass] = useState(defaultClass);
  const { data: classes } = useSWR("/api/classes", getAllClasses);

  const onSelectedClassChange = (value) => {
    setSelectedClass(value);
  };

  const classList = [
    { label: "All", value: "all" },
    ...(classes?.map((item) => ({
      label: item?.name,
      value: item?.name,
    })) || []),
  ];

  return {
    selectedClass: selectedClass,
    onSelectedClassChange: onSelectedClassChange,
    classList: classList,
  };
}
