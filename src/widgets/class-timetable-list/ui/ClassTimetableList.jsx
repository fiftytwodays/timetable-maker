import { useState } from "react";
import { Button, Space } from "antd";
import useSWR from "swr";

import { ClassTimetableList as _ClassTimetableList } from "@/entities/class-timetable";
import { useClasses, SelectClass } from "@/features/change-class";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import { getImageUrl } from "@/entities/school/lib/get-image-url";
import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";
import { generateTimetable } from "@/entities/class-timetable/lib/generate-timetable";
import { useDownloadTimetable } from "@/features/download-timetable";

const nameOf = (entry) =>
  entry?.expand?.class_sub_teach_ass?.expand?.class_name?.name;

function ClassTimetableList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { selectedClass, onSelectedClassChange, classList } = useClasses("all");

  const { data: periods, isLoading: isPeriodsLoading } = useSWR(
    ["/api/periods"],
    () => getAllPeriods()
  );

  const { data: schoolDetails, isLoading: isSchoolDetailLoading } = useSWR(
    ["/api/school"],
    getSchoolInfo
  );

  const selectedNames =
    selectedClass === "all"
      ? classList
          .filter((item) => item?.value !== "all")
          .map((item) => item?.value)
      : [selectedClass];

  const { download, isDownloading } = useDownloadTimetable({
    fileName:
      selectedClass === "all"
        ? "Class timetables"
        : `Class timetable - ${selectedClass}`,
    periods,
    logoURL: getImageUrl(schoolDetails?.[0]),
    getTimetables: async () => {
      const entries = await listClassTimetable({ sort: "-created" });
      return selectedNames.map((name) => ({
        title: name,
        rows: generateTimetable(
          entries.filter((entry) => nameOf(entry) === name)
        ),
      }));
    },
    // Subject and teacher; the third item is the entry id.
    getCellLines: (cell) => cell?.slice(0, 2) ?? [],
  });

  let AllTimetables = [];

  if (selectedClass === "all") {
    AllTimetables = classList.map((item, index) => {
      if (item?.value === "all") {
        return null;
      }

      return (
        <div key={item?.value}>
          <_ClassTimetableList
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
        <Button onClick={download} loading={isDownloading}>
          Download
        </Button>
      </Space>

      <div>
        <div>
          {selectedClass === "all" ? (
            AllTimetables
          ) : (
            <_ClassTimetableList
              pageNo={pageNo}
              setPageNo={setPageNo}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isPeriodsLoading}
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

export default ClassTimetableList;
