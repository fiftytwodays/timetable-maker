export const formFields = [
  {
    name: "name",
    label: "Name",
    required: true,
    unique: true,
    placeholder: "P1",
    // The timetable layouts only have columns for P1 to P5.
    extra: "One of P1 to P5, matching the timetable columns.",
    rules: [
      {
        pattern: /^P[1-5]$/,
        message: "Use one of P1, P2, P3, P4 or P5",
      },
    ],
  },
  {
    name: "duration",
    label: "Duration",
    placeholder: "10:00 - 11:30",
  },
];
