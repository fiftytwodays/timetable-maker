import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "timetableMakerFiles",
  access: (allow) => ({
    "school-logo/*": [
      allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
      allow.authenticated.to(["read"]),
    ],
  }),
});
