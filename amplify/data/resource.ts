import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

import { manageUsers } from "../functions/manage-users/resource";

/**
 * SchoolDay data model. Admins can change everything; teachers can
 * read. The user management operations are admin only.
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
      // ISO weekdays the school works (1 = Monday ... 7 = Sunday). Empty
      // means Monday to Saturday.
      workingWeekdays: a.integer().array(),
      // How many days back teachers can fill in checklists: 0 = only the
      // current day or week, empty = no limit.
      checklistLateDays: a.integer(),
    }),

    // A holiday, or an extra working day on a normally-off day, from
    // startDate to endDate inclusive. Holidays win where both apply.
    CalendarEntry: a.model({
      name: a.string().required(),
      type: a.enum(["HOLIDAY", "WORKING_DAY"]),
      startDate: a.date().required(),
      endDate: a.date().required(),
    }),

    SchoolClass: a.model({
      name: a.string(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "classId"),
    }),

    Teacher: a.model({
      name: a.string(),
      // Login linked to this teacher: the Cognito user's sub and username.
      userId: a.string(),
      username: a.string(),
      // The teacher who reviews this teacher's checklists; must have a login.
      // Without one, their checklists are reviewed automatically.
      coordinatorId: a.id(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "teacherId"),
      checklistAssignments: a.hasMany("ChecklistAssignment", "teacherId"),
    }),

    Subject: a.model({
      name: a.string(),
      associations: a.hasMany("ClassSubjectTeacherAssociation", "subjectId"),
    }),

    Day: a.model({
      name: a.string(),
      timetableEntries: a.hasMany("ClassTimetable", "dayId"),
    }),

    // A lesson or a break in the school day. Timetable columns follow the
    // periods in start time order.
    Period: a.model({
      name: a.string(),
      type: a.enum(["LESSON", "BREAK"]),
      // 24-hour "HH:mm"
      startTime: a.string(),
      endTime: a.string(),
      timetableEntries: a.hasMany("ClassTimetable", "periodId"),
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

    Checklist: a.model({
      title: a.string().required(),
      description: a.string(),
      frequency: a.enum(["DAILY", "WEEKLY", "ONCE"]),
      // How far back teachers can fill it in: the school setting (default),
      // `lateDays` days, or no limit.
      lateLimit: a.enum(["SCHOOL_DEFAULT", "CUSTOM", "NO_LIMIT"]),
      lateDays: a.integer(),
      items: a.hasMany("ChecklistItem", "checklistId"),
      assignments: a.hasMany("ChecklistAssignment", "checklistId"),
    }),

    // One activity to check off within a checklist.
    ChecklistItem: a.model({
      checklistId: a.id().required(),
      checklist: a.belongsTo("Checklist", "checklistId"),
      title: a.string().required(),
      sortOrder: a.integer(),
    }),

    // Links a checklist to a teacher who has to complete it.
    ChecklistAssignment: a.model({
      checklistId: a.id().required(),
      checklist: a.belongsTo("Checklist", "checklistId"),
      teacherId: a.id().required(),
      teacher: a.belongsTo("Teacher", "teacherId"),
    }),

    // A Cognito user; `id` is the username.
    User: a.customType({
      id: a.string().required(),
      sub: a.string(),
      email: a.string(),
      name: a.string(),
      role: a.string(),
      enabled: a.boolean(),
      status: a.string(),
      createdAt: a.string(),
      // Only set when a user is created, so the admin can hand it over.
      temporaryPassword: a.string(),
    }),

    listUsers: a
      .query()
      .returns(a.ref("User").array())
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(manageUsers)),

    createUser: a
      .mutation()
      .arguments({
        username: a.string().required(),
        email: a.string(),
        name: a.string(),
        role: a.string().required(),
      })
      .returns(a.ref("User"))
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(manageUsers)),

    updateUser: a
      .mutation()
      .arguments({
        id: a.string().required(),
        email: a.string(),
        name: a.string(),
        role: a.string(),
        enabled: a.boolean(),
      })
      .returns(a.ref("User"))
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(manageUsers)),

    deleteUser: a
      .mutation()
      .arguments({ id: a.string().required() })
      .returns(a.boolean())
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(manageUsers)),

    // Returns the new temporary password.
    resetUserPassword: a
      .mutation()
      .arguments({ id: a.string().required() })
      .returns(a.string())
      .authorization((allow) => [allow.group("ADMIN")])
      .handler(a.handler.function(manageUsers)),
  })
  .authorization((allow) => [
    allow.group("ADMIN"),
    allow.group("TEACHER").to(["read"]),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
