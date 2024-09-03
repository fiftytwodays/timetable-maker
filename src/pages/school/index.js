import { SchoolDetails } from "@/entities/school";
import { Page } from "@/shared/ui/page";

function School() {
  return (
    <Page
      showPageHeader
      header={{
        title: "School",
        breadcrumbs: [
          {
            title: "Home",
          },
          {
            title: "School",
          },
        ],
      }}
      content={<SchoolDetails />}
    />
  );
}

export default School;
