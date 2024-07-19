import { ClassesList } from "@/widgets/classes-list";
import { Page } from "@/shared/ui/page";

function Classes() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Classes",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Classes",
          },
        ],
      }}
      content={<ClassesList />}
    ></Page>
  );
}

export default Classes;
