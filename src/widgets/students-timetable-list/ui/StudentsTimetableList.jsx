import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Space } from "antd";
import useSWR from "swr";

import { StudentsTimetableList as _StudentsTimetableList } from "@/entities/students-timetable";
import { useClasses, SelectClass } from "@/features/change-class";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import { getImageUrl } from "@/entities/school/lib/get-image-url";

function StudentsTimetableList() {
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

  const { data: schoolDetails, isLoading: isSchoolDetailLoading } = useSWR(
    ["/api/school"],
    getSchoolInfo
  );

  let AllTimetables = [];

  if (selectedClass === "all") {
    AllTimetables = classList.map((item, index) => {
      if (item?.value === "all") {
        return null;
      }

      return (
        <div key={item?.value}>
          <_StudentsTimetableList
            isLoading={isPeriodsLoading || isSchoolDetailLoading}
            selectedClass={item?.value}
            periods={periods}
            logoURL={getImageUrl(schoolDetails?.[0])}
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
            <_StudentsTimetableList
              pageNo={pageNo}
              setPageNo={setPageNo}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isPeriodsLoading || isSchoolDetailLoading}
              selectedClass={selectedClass}
              periods={periods}
              logoURL={getImageUrl(schoolDetails?.[0])}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default StudentsTimetableList;
