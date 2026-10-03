import { ClassTimetableAssociationList } from "@/widgets/cta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Timetable entries",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Timetable entries",
          },
        ],
      }}
      content={<ClassTimetableAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
