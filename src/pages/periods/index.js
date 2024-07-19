import { PeriodsList } from "@/widgets/periods-list";
import { Page } from "@/shared/ui/page";

function Periods() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Periods",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Periods",
          },
        ],
      }}
      content={<PeriodsList />}
    ></Page>
  );
}

export default Periods;
