/** Formats a 24-hour "HH:mm" time as "1:00 PM". */
export const formatTime = (time) => {
  if (!time) {
    return "";
  }
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "AM" : "PM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

/** Formats a start and end time as "1:00 PM – 2:00 PM". */
export const formatTimeRange = (startTime, endTime) =>
  startTime && endTime
    ? `${formatTime(startTime)} – ${formatTime(endTime)}`
    : "";
