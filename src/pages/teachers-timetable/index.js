import { TeachersTimetableList } from "@/widgets/teachers-timetable-list";
import { Page } from "@/shared/ui/page";

function TeachersTimetable() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Teachers timetable",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Teachers timetable",
          },
        ],
      }}
      content={<TeachersTimetableList />}
    />
  );
}

export default TeachersTimetable;
