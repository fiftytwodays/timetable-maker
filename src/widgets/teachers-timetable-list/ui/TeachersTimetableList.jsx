import { useState } from "react";
import { Button, Space } from "antd";
import useSWR from "swr";

import { TeachersTimetableList as _TeachersTimetableList } from "@/entities/teachers-timetable";
import { useTeachers, SelectTeacher } from "@/features/change-teacher";
import { getAllPeriods } from "@/entities/periods/api/get-periods";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import { getImageUrl } from "@/entities/school/lib/get-image-url";
import { listClassTimetable } from "@/entities/cta/api/list-class-timetable";
import { generateTimetable } from "@/entities/teachers-timetable/lib/generate-timetable";
import { useDownloadTimetable } from "@/features/download-timetable";

const nameOf = (entry) =>
  entry?.expand?.class_sub_teach_ass?.expand?.teacher_name?.name;

function TeachersTimetableList() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  const selectedNames =
    selectedTeacher === "all"
      ? teachersList
          .filter((item) => item?.value !== "all")
          .map((item) => item?.value)
      : [selectedTeacher];

  const { download, isDownloading } = useDownloadTimetable({
    fileName:
      selectedTeacher === "all"
        ? "Teachers timetables"
        : `Teachers timetable - ${selectedTeacher}`,
    periods,
    // A fresh signed URL, as the one loaded with the page may have expired.
    getLogoURL: async () => getImageUrl((await getSchoolInfo())?.[0]),
    getTimetables: async () => {
      const entries = await listClassTimetable({ sort: "-created" });
      return selectedNames.map((name) => ({
        title: name,
        rows: generateTimetable(
          entries.filter((entry) => nameOf(entry) === name)
        ),
      }));
    },
    // Subject and class.
    getCellLines: (cell) => cell ?? [],
  });

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
        <Button onClick={download} loading={isDownloading}>
          Download
        </Button>
      </Space>

      <div>
        <div>
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
