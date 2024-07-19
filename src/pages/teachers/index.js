import { Page } from "@/shared/ui/page";
import { TeachersList } from "@/widgets/teachers-list";

function Teachers() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Teachers",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Teachers",
          },
        ],
      }}
      content={<TeachersList />}
    ></Page>
  );
}

export default Teachers;
