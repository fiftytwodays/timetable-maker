import { Page } from "@/shared/ui/page";
import { ChecklistsList } from "@/widgets/checklists-list";

function Checklists() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Checklists",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Checklists",
          },
        ],
      }}
      content={<ChecklistsList />}
    ></Page>
  );
}

export default Checklists;
