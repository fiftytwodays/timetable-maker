import { ClassTimetableAssociationList } from "@/widgets/cta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "CTA List",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "CTA List",
          },
        ],
      }}
      content={<ClassTimetableAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
