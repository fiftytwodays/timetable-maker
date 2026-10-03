/**
 * Teacher form fields. The coordinator can be any other teacher with a login,
 * because they sign in to review checklists. `hasLogin(teacher)` tells which
 * teachers have one.
 */
export const getFormFields = ({ teachers = [], hasLogin }) => (teacher) => [
  {
    name: "name",
    label: "Name",
    required: true,
    unique: true,
  },
  {
    name: "coordinatorId",
    label: "Coordinator",
    type: "select",
    placeholder: "No coordinator",
    extra:
      "Reviews this teacher's checklists. Only teachers with a login are listed. Without a coordinator, checklists are reviewed automatically.",
    options: teachers
      .filter(
        (candidate) =>
          candidate.id !== teacher.id &&
          (hasLogin(candidate) || candidate.id === teacher.coordinatorId)
      )
      .map((candidate) => ({
        value: candidate.id,
        label: hasLogin(candidate)
          ? candidate.name
          : `${candidate.name} (no login)`,
      })),
  },
];
