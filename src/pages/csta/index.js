import { ClassSubjectTeacherAssociationList } from "@/widgets/csta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "CSTA List",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "CSTA List",
          },
        ],
      }}
      content={<ClassSubjectTeacherAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
