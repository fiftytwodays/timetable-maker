import { useEffect } from "react";
import { useRouter } from "next/router";

import useCurrentUser from "@/shared/lib/use-current-user";

// Admins start at the timetables; teachers at their checklists.
export default function Index() {
  const router = useRouter();
  const { isLoading, isAdmin } = useCurrentUser();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAdmin ? "/class-timetable" : "/my-checklists");
    }
  }, [isLoading, isAdmin, router]);

  return null;
}
