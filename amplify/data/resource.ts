import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

import { manageUsers } from "../functions/manage-users/resource";

/**
 * Timetable maker data model. Admins can change everything; teachers can
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

    Checklist: a.model({
      title: a.string().required(),
      description: a.string(),
      frequency: a.enum(["DAILY", "WEEKLY", "ONCE"]),
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
