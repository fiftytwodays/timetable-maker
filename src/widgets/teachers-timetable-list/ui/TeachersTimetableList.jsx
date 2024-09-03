import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Space } from "antd";
import useSWR from "swr";

import { TeachersTimetableList as _TeachersTimetableList } from "@/entities/teachers-timetable";
import { useTeachers, SelectTeacher } from "@/features/change-teacher";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import { getImageUrl } from "@/entities/school/lib/get-image-url";

function TeachersTimetableList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { selectedTeacher, onSelectedTeacherChange, teachersList } =
    useTeachers("all");

  const { data: periods, isLoading: isPeriodsLoading } = useSWR(
    ["/api/periods"],
    () => getAllPeriods()
  );

  const { data: schoolDetails, isLoading: isSchoolDetailLoading } = useSWR(
    ["/api/school"],
    getSchoolInfo
  );

  let AllTimetables = [];

  if (selectedTeacher === "all") {
    AllTimetables = teachersList.map((item, index) => {
      if (item?.value === "all") {
        return null;
      }

      return (
        <div key={item?.value}>
          <_TeachersTimetableList
            isLoading={isPeriodsLoading || isSchoolDetailLoading}
            selectedTeacher={item?.value}
            periods={periods}
            logoURL={getImageUrl(schoolDetails?.[0])}
          />
          {index < teachersList.length - 1 && <div className="page-break" />}
        </div>
      );
    });
  }

  return (
    <>
      <Space>
        <SelectTeacher
          selectedTeacher={selectedTeacher}
          onSelectedTeacherChange={onSelectedTeacherChange}
          teachersList={teachersList}
        />
        <Button onClick={handlePrint}>Download</Button>
      </Space>

      <div>
        <div ref={componentRef}>
          {selectedTeacher === "all" ? (
            AllTimetables
          ) : (
            <_TeachersTimetableList
              pageNo={pageNo}
              setPageNo={setPageNo}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isPeriodsLoading}
              selectedTeacher={selectedTeacher}
              periods={periods}
              logoURL={getImageUrl(schoolDetails?.[0])}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TeachersTimetableList;
