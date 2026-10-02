import {
  Document,
  Image as PdfImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { formatTimeRange } from "@/shared/lib/format-time";

// A4 landscape is 842 x 595 points.
const PAGE_HEIGHT = 595;
const PAGE_PADDING = 24;
const TITLE_HEIGHT = 36;
const HEADER_HEIGHT = 52;
const MAX_ROW_HEIGHT = 72;
const DAY_COLUMN_WIDTH = 90;
const BREAK_COLUMN_WIDTH = 46;
const BORDER_COLOR = "#8c8c8c";

const styles = StyleSheet.create({
  page: {
    padding: PAGE_PADDING,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  title: {
    height: TITLE_HEIGHT,
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  table: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: BORDER_COLOR,
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#f0f0f0",
  },
  headerName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  time: {
    fontSize: 8,
    marginTop: 2,
  },
  day: {
    fontFamily: "Helvetica-Bold",
  },
  lesson: {
    fontFamily: "Helvetica-Bold",
  },
  detail: {
    marginTop: 2,
  },
  empty: {
    color: "#bfbfbf",
  },
  breakText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    lineHeight: 1.3,
  },
  logo: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
});

// Breaks span every day, so their name is written one letter per line.
const toVerticalText = (text = "") => text.toUpperCase().split("").join("\n");

function TimetableTable({ rows, periods, logo, getCellLines }) {
  const available =
    PAGE_HEIGHT - PAGE_PADDING * 2 - TITLE_HEIGHT - HEADER_HEIGHT;
  const rowHeight = Math.min(
    MAX_ROW_HEIGHT,
    Math.floor(available / Math.max(rows.length, 1))
  );

  return (
    <View style={styles.table}>
      <View style={{ width: DAY_COLUMN_WIDTH }}>
        <View style={[styles.cell, styles.header]}>
          {logo ? (
            <PdfImage src={logo} style={styles.logo} />
          ) : (
            <Text style={styles.headerName}>Day</Text>
          )}
        </View>
        {rows.map((row) => (
          <View key={row.day} style={[styles.cell, { height: rowHeight }]}>
            <Text style={styles.day}>{row.day}</Text>
          </View>
        ))}
      </View>

      {periods.map((period) => {
        const time = formatTimeRange(period.startTime, period.endTime);

        if (period.type === "BREAK") {
          return (
            <View key={period.id} style={{ width: BREAK_COLUMN_WIDTH }}>
              <View style={[styles.cell, styles.header]}>
                {time && <Text style={styles.time}>{time}</Text>}
              </View>
              <View
                style={[styles.cell, { height: rowHeight * rows.length }]}
              >
                <Text style={styles.breakText}>
                  {toVerticalText(period.name)}
                </Text>
              </View>
            </View>
          );
        }

        return (
          <View key={period.id} style={{ flex: 1 }}>
            <View style={[styles.cell, styles.header]}>
              <Text style={styles.headerName}>{period.name}</Text>
              {time && <Text style={styles.time}>{time}</Text>}
            </View>
            {rows.map((row) => {
              const [first, ...rest] = getCellLines(row[period.id]);
              return (
                <View
                  key={row.day}
                  style={[styles.cell, { height: rowHeight }]}
                >
                  {first ? (
                    <>
                      <Text style={styles.lesson}>{first}</Text>
                      {rest.map((line, index) => (
                        <Text key={index} style={styles.detail}>
                          {line}
                        </Text>
                      ))}
                    </>
                  ) : (
                    <Text style={styles.empty}>---</Text>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

/**
 * One A4 landscape page per timetable, with the title centered above the
 * table.
 */
export default function TimetableDocument({
  title,
  timetables,
  periods,
  logo,
  getCellLines,
}) {
  return (
    <Document title={title}>
      {timetables.map((timetable) => (
        <Page
          key={timetable.title}
          size="A4"
          orientation="landscape"
          style={styles.page}
        >
          <Text style={styles.title}>{timetable.title}</Text>
          <TimetableTable
            rows={timetable.rows}
            periods={periods}
            logo={logo}
            getCellLines={getCellLines}
          />
        </Page>
      ))}
    </Document>
  );
}
