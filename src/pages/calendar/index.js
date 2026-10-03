import { Page } from "@/shared/ui/page";
import { SchoolCalendar } from "@/widgets/school-calendar";

function SchoolCalendarPage() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Calendar",
        breadcrumbs: [
          {
            title: "Home",
          },
          {
            title: "Calendar",
          },
        ],
      }}
      content={<SchoolCalendar />}
    />
  );
}

export default SchoolCalendarPage;
