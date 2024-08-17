import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Space } from "antd";
import useSWR from "swr";

import { ClassTimetableList as _ClassTimetableList } from "@/entities/class-timetable";
import { useClasses, SelectClass } from "@/features/change-class";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { getAllDays } from "@/entities/days/api/get-days";

function EditableTimetableList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { selectedClass, onSelectedClassChange, classList } = useClasses("all");

  const { data: periods, isLoading: isPeriodsLoading } = useSWR(
    ["/api/periods"],
    () => getAllPeriods()
  );

  const { data: days, isLoading: isDaysLoading } = useSWR(
    ["/api/days"],
    getAllDays
  );

  let AllTimetables = [];

  if (selectedClass === "all") {
    AllTimetables = classList.map((item, index) => {
      if (item?.value === "all") {
        return null;
      }

      return (
        <div key={item?.value}>
          <_ClassTimetableList
            isLoading={false}
            selectedClass={item?.value}
            periods={periods}
            days={days}
            isEditable={true}
          />
          {index < classList.length - 1 && <div className="page-break" />}
        </div>
      );
    });
  }

  return (
    <>
      <Space>
        <SelectClass
          selectedClass={selectedClass}
          onSelectedClassChange={onSelectedClassChange}
          classList={classList}
        />
        <Button onClick={handlePrint}>Download</Button>
      </Space>

      <div>
        <div ref={componentRef}>
          {selectedClass === "all" ? (
            AllTimetables
          ) : (
            <_ClassTimetableList
              pageNo={pageNo}
              setPageNo={setPageNo}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isPeriodsLoading || isDaysLoading}
              selectedClass={selectedClass}
              periods={periods}
              days={days}
              isEditable={true}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default EditableTimetableList;
