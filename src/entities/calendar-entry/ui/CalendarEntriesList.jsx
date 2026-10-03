import useSWR from "swr";

import { EntityList } from "@/shared/ui";
import { columns } from "../config/columns";
import { getAllCalendarEntries } from "../api/get-calendar-entries";

function CalendarEntriesList({
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  extraColumns = [],
  toolbarExtensions = [],
}) {
  const { data, isLoading } = useSWR(
    ["/api/calendar-entries"],
    getAllCalendarEntries
  );

  return (
    <EntityList
      isLoading={isLoading}
      columns={[...columns, ...extraColumns]}
      data={data}
      rowKey="id"
      totalCount={data?.length}
      pageNo={pageNo}
      setPageNo={setPageNo}
      pageSize={pageSize}
      setPageSize={setPageSize}
      isPaginationVisible={true}
      showToolbar={toolbarExtensions.length > 0}
      toolbarExtensions={toolbarExtensions}
    />
  );
}

export default CalendarEntriesList;
