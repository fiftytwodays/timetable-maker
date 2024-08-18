import { ClassSubjectTeacherAssociationList } from "@/widgets/csta-list";
import { Page } from "@/shared/ui/page";

function ClassSubjectTeacherAssociation() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Class-Subject-Teacher association",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Class-Subject-Teacher association",
          },
        ],
      }}
      content={<ClassSubjectTeacherAssociationList />}
    />
  );
}

export default ClassSubjectTeacherAssociation;
