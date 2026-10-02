import { defineAuth } from "@aws-amplify/backend";

import { manageUsers } from "../functions/manage-users/resource";

export const auth = defineAuth({
  // Email stays enabled for invitations and password recovery; backend.ts
  // switches the sign-in name to a username and makes email optional.
  loginWith: {
    email: true,
  },
  groups: ["ADMIN", "TEACHER"],
  access: (allow) => [
    allow
      .resource(manageUsers)
      .to([
        "createUser",
        "deleteUser",
        "deleteUserAttributes",
        "disableUser",
        "enableUser",
        "getUser",
        "listUsers",
        "listUsersInGroup",
        "addUserToGroup",
        "removeUserFromGroup",
        "setUserPassword",
        "updateUserAttributes",
      ]),
  ],
});
