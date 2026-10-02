import { defineFunction } from "@aws-amplify/backend";

export const manageUsers = defineFunction({
  name: "manage-users",
  // Grouped with auth to avoid a circular dependency between the auth and
  // data stacks (data invokes this function, which calls the user pool).
  resourceGroupName: "auth",
  timeoutSeconds: 30,
});
