import { useEffect } from "react";
import { mutate } from "swr";

import { client, unwrap } from "@/shared/lib/amplify";

// The default school, days and periods for a new deployment.
// Fixed ids make the seeding idempotent if two users sign in at the same time.
const INITIAL_DATA = {
  School: [
    {
      id: "school",
      name: "School",
      email: "admin@timetable.com",
      phone: "0000",
      contact: "Admin",
      address: "",
    },
  ],
  Day: [
    { id: "monday", name: "Monday" },
    { id: "tuesday", name: "Tuesday" },
    { id: "wednesday", name: "Wednesday" },
    { id: "thursday", name: "Thursday" },
    { id: "friday", name: "Friday" },
    { id: "saturday", name: "Saturday" },
  ],
  Period: [
    { id: "p1", name: "P1", duration: "10:00 - 11:30" },
    { id: "p2", name: "P2", duration: "11:30 - 1:00" },
    { id: "p3", name: "P3", duration: "2:00- 3:30" },
    { id: "p4", name: "P4", duration: "3:30 - 5:00" },
  ],
};

let isInitialDataChecked = false;

const seedModel = async (modelName, records) => {
  const model = client.models[modelName];
  const existing = unwrap(await model.list({ limit: 1 }));

  // Only seed empty tables so records the user deleted are not recreated.
  if (existing.length > 0) {
    return;
  }
  // Errors are ignored: a concurrent seed may already have created the record.
  await Promise.all(records.map((record) => model.create(record)));
};

const EnsureInitialData = () => {
  useEffect(() => {
    if (isInitialDataChecked) {
      return;
    }
    isInitialDataChecked = true;

    Promise.all(
      Object.entries(INITIAL_DATA).map(([modelName, records]) =>
        seedModel(modelName, records)
      )
    )
      .then(() => mutate(() => true))
      .catch((error) => {
        isInitialDataChecked = false;
        console.error("Failed to create initial data:", error);
      });
  }, []);

  return null;
};

export default EnsureInitialData;
