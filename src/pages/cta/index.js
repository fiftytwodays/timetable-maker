import { ClassTimetableAssociationList } from "@/widgets/cta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Class-Timetable association",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Class-Timetable association",
          },
        ],
      }}
      content={<ClassTimetableAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
