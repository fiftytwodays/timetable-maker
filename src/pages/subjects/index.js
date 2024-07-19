import { SubjectsList } from "@/widgets/subjects-list";
import { Page } from "@/shared/ui/page";

function Subjects() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Subjects",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Subjects",
          },
        ],
      }}
      content={<SubjectsList />}
    ></Page>
  );
}

export default Subjects;
