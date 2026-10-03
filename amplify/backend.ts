import { defineBackend } from "@aws-amplify/backend";
import type { aws_cognito } from "aws-cdk-lib";

import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { manageUsers } from "./functions/manage-users/resource";
import { checklistWorkflow } from "./functions/checklist-workflow/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  manageUsers,
  checklistWorkflow,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

// Only administrators can create users (from the Users and Teachers pages);
// self sign-up is disabled so a public URL does not grant edit access.
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

// Users sign in with their username, or with their email if they have one.
// Email is optional, so teachers without one can still log in; it is also
// used for invitations and password recovery, and must be unique.
// Changing how a user pool signs users in replaces the pool.
cfnUserPool.usernameAttributes = undefined;
cfnUserPool.aliasAttributes = ["email"];
cfnUserPool.schema = (
  cfnUserPool.schema as aws_cognito.CfnUserPool.SchemaAttributeProperty[]
).map((attribute) =>
  attribute.name === "email" ? { ...attribute, required: false } : attribute
);
