import { useState } from "react";
import {
  Alert,
  Button,
  DatePicker,
  Empty,
  Flex,
  Skeleton,
  Space,
  Switch,
  Table,
  Tabs,
  Typography,
} from "antd";
import dayjs from "dayjs";
import useSWR, { mutate } from "swr";

import { getAllCalendarEntries } from "@/entities/calendar-entry/api/get-calendar-entries";
import { getAllChecklists } from "@/entities/checklist/api/get-checklists";
import { FREQUENCY_LABELS } from "@/entities/checklist/config/columns";
import {
  LateTag,
  StatusTag,
  formatPeriod,
} from "@/entities/checklist-submission";
import { getTeacherSubmissions } from "@/entities/checklist-submission/api/get-submissions";
import { getSchoolInfo } from "@/entities/school/api/get-school-info";
import useMyTeacher from "@/entities/teacher/lib/use-my-teacher";
import { FillInChecklistModal } from "@/features/fill-in-checklist";
import {
  EDITABLE_STATUSES,
  getFillInState,
  getLateDaysLimit,
  getPeriod,
  isChecklistDue,
  submissionId,
  todayInSchool,
} from "@/shared/lib/checklist-rules";
import { getDayInfo, getWorkingWeekdays } from "@/shared/lib/school-calendar";

// Nothing was saved and it can no longer be filled in.
const isClosed = (row) => !row.submission && !row.fillIn.canFillIn;

const STATUS_ORDER = {
  RETURNED: 0,
  IN_PROGRESS: 1,
  NOT_STARTED: 2,
  SUBMITTED: 3,
  REVIEWED: 4,
};

const rowOrder = (row) =>
  isClosed(row) ? 5 : STATUS_ORDER[row.submission?.status || "NOT_STARTED"];

const FILL_IN_REFUSALS = {
  TOO_LATE: "Too late to fill in",
  NOT_STARTED: "Not started yet",
};

function MyChecklists() {
  const { teacher, isLoading: isTeacherLoading } = useMyTeacher();
  const today = todayInSchool();
  const [date, setDate] = useState(today);
  const [opened, setOpened] = useState(null);
  const [openCount, setOpenCount] = useState(0);
  const [showClosed, setShowClosed] = useState(false);

  const { data: checklists } = useSWR(["/api/checklists"], getAllChecklists);
  const { data: schools } = useSWR(["/api/school"], getSchoolInfo);
  const { data: entries } = useSWR(
    ["/api/calendar-entries"],
    getAllCalendarEntries
  );
  const submissionsKey = teacher ? ["/api/my-submissions", teacher.id] : null;
  const { data: submissions, error: submissionsError } = useSWR(
    submissionsKey,
    () => getTeacherSubmissions(teacher.id)
  );

  if (isTeacherLoading) {
    return <Skeleton active />;
  }
  if (!teacher) {
    return (
      <Alert
        type="info"
        showIcon
        message="Your login is not linked to a teacher"
        description="Checklists are assigned to teachers. Ask an admin to link your login to your teacher record on the Teachers or Users page."
      />
    );
  }

  const isLoading = !checklists || !schools || !entries || !submissions;
  const school = schools?.[0];
  const calendar = {
    workingWeekdays: getWorkingWeekdays(school),
    entries: entries || [],
  };
  const myChecklists = (checklists || []).filter((checklist) =>
    checklist.teacherIds.includes(teacher.id)
  );
  const checklistsById = new Map(
    (checklists || []).map((checklist) => [checklist.id, checklist])
  );
  const submissionsById = new Map(
    (submissions || []).map((submission) => [submission.id, submission])
  );

  // A checklist's state for the day or week containing `day`.
  const describe = (checklist, day) => {
    const period = getPeriod(checklist.frequency, day);
    const submission = submissionsById.get(
      submissionId(checklist.id, teacher.id, period.periodKey)
    );
    const fillIn = getFillInState({
      frequency: checklist.frequency,
      period,
      today,
      lateDays: getLateDaysLimit(checklist, school),
    });
    return { checklist, period, submission, fillIn, date: day };
  };

  // Things to do first, then submitted ones, then those that can no longer
  // be filled in (hidden unless asked for).
  const allDueRows = isLoading
    ? []
    : myChecklists
        .filter((checklist) => isChecklistDue(checklist, date, calendar))
        .map((checklist) => describe(checklist, date))
        .sort(
          (a, b) =>
            rowOrder(a) - rowOrder(b) ||
            a.checklist.title.localeCompare(b.checklist.title)
        );
  const closedCount = allDueRows.filter(isClosed).length;
  const dueRows = showClosed
    ? allDueRows
    : allDueRows.filter((row) => !isClosed(row));

  const open = (row) => {
    setOpened(row);
    setOpenCount((count) => count + 1);
  };

  const actionFor = (row) => {
    const canEdit =
      row.checklist.teacherIds.includes(teacher.id) &&
      row.fillIn.canFillIn &&
      (!row.submission || EDITABLE_STATUSES.includes(row.submission.status));
    if (canEdit) {
      return (
        <Button type="primary" size="small" onClick={() => open(row)}>
          {row.submission ? "Continue" : "Fill in"}
        </Button>
      );
    }
    if (row.submission) {
      return (
        <Button size="small" onClick={() => open(row)}>
          View
        </Button>
      );
    }
    return (
      <Typography.Text type="secondary">
        {FILL_IN_REFUSALS[row.fillIn.reason]}
      </Typography.Text>
    );
  };

  const statusColumn = {
    title: "Status",
    key: "status",
    width: 220,
    render: (_, row) => (
      <Space size="small">
        <StatusTag
          status={row.submission?.status || "NOT_STARTED"}
          autoReviewed={row.submission?.autoReviewed}
        />
        {row.submission?.isLate && <LateTag />}
      </Space>
    ),
  };

  const dueColumns = [
    {
      title: "Checklist",
      key: "title",
      render: (_, row) => row.checklist.title,
    },
    {
      title: "Frequency",
      key: "frequency",
      width: 120,
      render: (_, row) => FREQUENCY_LABELS[row.checklist.frequency],
    },
    {
      title: "For",
      key: "period",
      width: 200,
      render: (_, row) =>
        formatPeriod(row.checklist.frequency, row.period.start),
    },
    statusColumn,
    {
      title: "",
      key: "action",
      width: 170,
      render: (_, row) => actionFor(row),
    },
  ];

  // History of this teacher's submissions, including checklists no longer
  // assigned to them; those of deleted checklists are only kept for admins.
  const historyRows = (submissions || [])
    .filter((submission) => checklistsById.has(submission.checklistId))
    .map((submission) => {
      const checklist = checklistsById.get(submission.checklistId);
      const day = submission.periodStart || today;
      return { ...describe(checklist, day), submission };
    });

  const historyColumns = [
    {
      title: "Checklist",
      key: "title",
      render: (_, row) => row.submission.checklistTitle,
    },
    {
      title: "For",
      key: "period",
      width: 200,
      render: (_, row) =>
        formatPeriod(row.submission.frequency, row.submission.periodStart),
    },
    statusColumn,
    {
      title: "Submitted",
      key: "submittedAt",
      width: 180,
      render: (_, row) =>
        row.submission.submittedAt
          ? dayjs(row.submission.submittedAt).format("D MMM YYYY, h:mm A")
          : "---",
    },
    {
      title: "Reviewed by",
      key: "reviewedBy",
      width: 160,
      render: (_, row) =>
        row.submission.autoReviewed
          ? "Automatic"
          : row.submission.reviewedBy || row.submission.coordinatorName || "---",
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_, row) => actionFor(row),
    },
  ];

  const { holiday } = getDayInfo(date, calendar);
  let emptyText = "Nothing due for this day";
  if (holiday) {
    emptyText = `Nothing due: ${holiday.name}`;
  } else if (closedCount > 0) {
    emptyText = "Nothing left to fill in for this day";
  }

  return (
    <>
      {submissionsError && (
        <Alert
          type="error"
          showIcon
          message="Could not load your checklists"
          description={submissionsError.message}
        />
      )}
      <Tabs
        items={[
          {
            key: "due",
            label: "Checklists",
            children: (
              <Flex vertical gap="middle">
                <Space wrap>
                  <Typography.Text>Show checklists for</Typography.Text>
                  <DatePicker
                    value={dayjs(date)}
                    format="ddd, D MMM YYYY"
                    allowClear={false}
                    disabledDate={(day) => day.format("YYYY-MM-DD") > today}
                    onChange={(day) => setDate(day.format("YYYY-MM-DD"))}
                  />
                  {date !== today && (
                    <Button onClick={() => setDate(today)}>Today</Button>
                  )}
                </Space>
                {closedCount > 0 && (
                  <Space>
                    <Switch
                      size="small"
                      checked={showClosed}
                      onChange={setShowClosed}
                    />
                    <Typography.Text type="secondary">
                      Show {closedCount} checklist
                      {closedCount === 1 ? "" : "s"} that can no longer be
                      filled in
                    </Typography.Text>
                  </Space>
                )}
                <Table
                  loading={isLoading}
                  rowKey={(row) => row.checklist.id}
                  columns={dueColumns}
                  dataSource={dueRows}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          myChecklists.length === 0
                            ? "No checklists are assigned to you"
                            : emptyText
                        }
                      />
                    ),
                  }}
                />
              </Flex>
            ),
          },
          {
            key: "history",
            label: "History",
            children: (
              <Table
                loading={isLoading}
                rowKey={(row) => row.submission.id}
                columns={historyColumns}
                dataSource={historyRows}
              />
            ),
          },
        ]}
      />
      {opened && (
        <FillInChecklistModal
          key={openCount}
          open
          checklist={opened.checklist}
          date={opened.date}
          periodLabel={formatPeriod(
            opened.checklist.frequency,
            opened.period.start
          )}
          submission={opened.submission}
          fillIn={opened.fillIn}
          onSaved={() => mutate(submissionsKey)}
          onClose={() => setOpened(null)}
        />
      )}
    </>
  );
}

export default MyChecklists;
