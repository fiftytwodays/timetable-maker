import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Timetable maker data model. Every signed-in user can read and write
 * every record.
 */
const schema = a
  .schema({
    School: a.model({
      name: a.string(),
      // S3 path of the uploaded logo (see amplify/storage/resource.ts)
      logo: a.string(),
      address: a.string(),
      email: a.string(),
      phone: a.string(),
      contact: a.string(),
    }),

    SchoolClass: a.model({
      name: a.string(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "classId"),
    }),

    Teacher: a.model({
      name: a.string(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "teacherId"),
    }),

    Subject: a.model({
      name: a.string(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "subjectId"),
    }),

    Day: a.model({
      name: a.string(),
      timetableEntries: a.hasMany("ClassTimetable", "dayId"),
    }),

    Period: a.model({
      name: a.string(),
      duration: a.string(),
      timetableEntries: a.hasMany("ClassTimetable", "periodId"),
    }),

    Setting: a.model({
      key: a.string(),
      value: a.string(),
      description: a.string(),
    }),

    ClassSubjectTeacherAssociation: a.model({
      name: a.string(),
      classId: a.id(),
      schoolClass: a.belongsTo("SchoolClass", "classId"),
      teacherId: a.id(),
      teacher: a.belongsTo("Teacher", "teacherId"),
      subjectId: a.id(),
      subject: a.belongsTo("Subject", "subjectId"),
      timetableEntries: a.hasMany("ClassTimetable", "cstaId"),
    }),

    // Previously the "CTA" collection: one subject/teacher slot in a class timetable.
    ClassTimetable: a.model({
      cstaId: a.id(),
      csta: a.belongsTo("ClassSubjectTeacherAssociation", "cstaId"),
      dayId: a.id(),
      day: a.belongsTo("Day", "dayId"),
      periodId: a.id(),
      period: a.belongsTo("Period", "periodId"),
    }),
  })
  .authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
