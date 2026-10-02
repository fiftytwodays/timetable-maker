import { toRecord } from "@/shared/lib/amplify";
import { toCstaRecord } from "@/entities/csta/lib/to-csta-record";

/**
 * Maps a ClassTimetable entry to the PocketBase "CTA" shape the UI reads:
 * relation ids on `class_sub_teach_ass`/`day`/`period` and the related
 * records under `expand`.
 */
export const toCtaRecord = (item) =>
  item && {
    ...toRecord(item),
    class_sub_teach_ass: item.cstaId,
    day: item.dayId,
    period: item.periodId,
    expand: {
      class_sub_teach_ass: toCstaRecord(item.csta),
      day: item.day,
      period: item.period,
    },
  };
