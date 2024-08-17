import { Page } from "@/shared/ui/page";
import { EditableTimetableList } from "@/widgets/editable-timetable-list";

function CreateTimetable() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Create class timetable",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Create class timetable",
          },
        ],
      }}
      content={<EditableTimetableList />}
    />
  );
}

export default CreateTimetable;
