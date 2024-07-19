import { ClassTimetableList } from "@/widgets/class-timetable-list";
import { Page } from "@/shared/ui/page";

function ClassTimetable() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Class timetable",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Class timetable",
          },
        ],
      }}
      content={<ClassTimetableList />}
    />
  );
}

export default ClassTimetable;
