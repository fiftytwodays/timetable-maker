import { ClassSubjectTeacherAssociationList } from "@/widgets/csta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Teaching assignments",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Teaching assignments",
          },
        ],
      }}
      content={<ClassSubjectTeacherAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
