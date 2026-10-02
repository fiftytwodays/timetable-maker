import { defineAuth } from "@aws-amplify/backend";

import { manageUsers } from "../functions/manage-users/resource";

export const auth = defineAuth({
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
        "disableUser",
        "enableUser",
        "getUser",
        "listUsers",
        "listUsersInGroup",
        "addUserToGroup",
        "removeUserFromGroup",
        "resetUserPassword",
        "updateUserAttributes",
      ]),
  ],
});
