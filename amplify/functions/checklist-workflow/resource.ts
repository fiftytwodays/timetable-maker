import { defineFunction } from "@aws-amplify/backend";

export const checklistWorkflow = defineFunction({
  name: "checklist-workflow",
  // Grouped with data to avoid a circular dependency: data invokes this
  // function, which reads and writes data.
  resourceGroupName: "data",
  timeoutSeconds: 30,
});
