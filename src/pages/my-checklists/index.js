import { Page } from "@/shared/ui/page";
import { MyChecklists } from "@/widgets/my-checklists";

function MyChecklistsPage() {
  return (
    <Page
      showPageHeader
      header={{
        title: "My checklists",
        breadcrumbs: [
          {
            title: "Home",
          },
          {
            title: "My checklists",
          },
        ],
      }}
      content={<MyChecklists />}
    />
  );
}

export default MyChecklistsPage;
