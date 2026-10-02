import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

// Only administrators can create users (via the Cognito console or CLI);
// self sign-up is disabled so a public URL does not grant edit access.
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};
