// Describes how far back teachers can fill in checklists.
export const describeLateDays = (days) => {
  if (days === null || days === undefined) {
    return "No limit";
  }
  if (days === 0) {
    return "Only today or this week";
  }
  return `Up to ${days} day${days === 1 ? "" : "s"} back`;
};
