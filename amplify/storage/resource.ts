import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "timetableMakerFiles",
  access: (allow) => ({
    "school-logo/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
