import { StudentsTimetableList } from "@/widgets/students-timetable-list";
import { Page } from "@/shared/ui/page";

function StudentsTimetable() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Students timetable",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Students timetable",
          },
        ],
      }}
      content={<StudentsTimetableList />}
    />
  );
}

export default StudentsTimetable;
