import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Calendar,
  Card,
  Checkbox,
  Flex,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import useSWR, { mutate } from "swr";

import { CalendarEntriesList } from "@/entities/calendar-entry";
import { getAllCalendarEntries } from "@/entities/calendar-entry/api/get-calendar-entries";
import {
  createCalendarEntry,
  updateCalendarEntry,
  deleteCalendarEntry,
} from "@/entities/calendar-entry/api/mutate-calendar-entry";
import { TYPE_COLORS } from "@/entities/calendar-entry/config/columns";
import { formFields } from "@/entities/calendar-entry/config/form-fields";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import { updateSchoolInfo } from "@/entities/school/api/update-school-info";
import { useManageEntity } from "@/features/manage-entity";
import {
  WEEKDAYS,
  getDayInfo,
  getWorkingWeekdays,
} from "@/shared/lib/school-calendar";
import useCurrentUser from "@/shared/lib/use-current-user";

function WorkingDays({ school, isAdmin }) {
  const savedWeekdays = getWorkingWeekdays(school);
  const [weekdays, setWeekdays] = useState(savedWeekdays);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setWeekdays(getWorkingWeekdays(school));
  }, [school]);

  const isChanged =
    [...weekdays].sort().join() !== [...savedWeekdays].sort().join();

  const onSave = async () => {
    setIsSaving(true);
    const result = await updateSchoolInfo(school.id, {
      workingWeekdays: [...weekdays].sort(),
    });
    setIsSaving(false);
    if (result?.id) {
      message.success("Working days updated!");
      mutate(["/api/school"]);
    } else {
      message.error(result?.message || "Could not save the working days.");
    }
  };

  return (
    <Card title="Working days" size="small">
      <Flex vertical gap="middle">
        <Typography.Text type="secondary">
          The days of the week the school normally works. Daily checklists
          are only due on school days.
        </Typography.Text>
        <Checkbox.Group
          value={weekdays}
          onChange={setWeekdays}
          disabled={!isAdmin}
          options={WEEKDAYS.map(({ value, label }) => ({ value, label }))}
        />
        {isAdmin && (
          <Space>
            <Button
              type="primary"
              onClick={onSave}
              loading={isSaving}
              disabled={!isChanged || weekdays.length === 0}
            >
              Save
            </Button>
            {weekdays.length === 0 && (
              <Typography.Text type="danger">
                Select at least one day
              </Typography.Text>
            )}
          </Space>
        )}
      </Flex>
    </Card>
  );
}

function SchoolCalendar() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { isAdmin } = useCurrentUser();
  const { data: schools, error: schoolError } = useSWR(
    ["/api/school"],
    getSchoolInfo
  );
  const { data: entries = [] } = useSWR(
    ["/api/calendar-entries"],
    getAllCalendarEntries
  );
  const school = schools?.[0];
  const calendar = { workingWeekdays: getWorkingWeekdays(school), entries };

  const { addButton, actionsColumn, formModal, openCreate, openEdit } =
    useManageEntity({
      entityName: "Calendar entry",
      fields: formFields,
      createRecord: createCalendarEntry,
      updateRecord: updateCalendarEntry,
      deleteRecord: deleteCalendarEntry,
    });

  const cellRender = (current, info) => {
    if (info.type !== "date") {
      return info.originNode;
    }
    const { holiday, extraWorkingDay, isSchoolDay } = getDayInfo(
      current.format("YYYY-MM-DD"),
      calendar
    );
    const entry = holiday || extraWorkingDay;
    if (entry) {
      return <Tag color={TYPE_COLORS[entry.type]}>{entry.name}</Tag>;
    }
    return isSchoolDay ? null : (
      <Typography.Text type="secondary">Off</Typography.Text>
    );
  };

  // Admins click a day to edit its entry, or to add one starting that day.
  const onSelect = (date, { source }) => {
    if (!isAdmin || source !== "date") {
      return;
    }
    const day = date.format("YYYY-MM-DD");
    const { holiday, extraWorkingDay } = getDayInfo(day, calendar);
    const entry = holiday || extraWorkingDay;
    if (entry) {
      openEdit(entry);
    } else {
      openCreate({ startDate: day });
    }
  };

  return (
    <Flex vertical gap="large">
      {schoolError && (
        <Alert
          type="error"
          showIcon
          message="Could not load the school settings"
          description={schoolError.message}
        />
      )}
      {school && <WorkingDays school={school} isAdmin={isAdmin} />}
      <Card
        title="Calendar"
        size="small"
        extra={
          isAdmin && (
            <Typography.Text type="secondary">
              Click a day to add or edit a holiday
            </Typography.Text>
          )
        }
      >
        <Calendar cellRender={cellRender} onSelect={onSelect} />
      </Card>
      <Card title="Holidays and extra working days" size="small">
        <CalendarEntriesList
          pageNo={pageNo}
          setPageNo={setPageNo}
          pageSize={pageSize}
          setPageSize={setPageSize}
          extraColumns={isAdmin ? [actionsColumn] : []}
          toolbarExtensions={isAdmin ? [addButton] : []}
        />
      </Card>
      {formModal}
    </Flex>
  );
}

export default SchoolCalendar;
