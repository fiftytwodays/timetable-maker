import useSWR from "swr";
import { fetchAuthSession } from "aws-amplify/auth";

const getCurrentUser = async () => {
  const { tokens } = await fetchAuthSession();
  const payload = tokens?.idToken?.payload || {};
  const groups = payload["cognito:groups"] || [];

  return {
    userId: payload.sub,
    email: payload.email,
    groups,
    isAdmin: groups.includes("ADMIN"),
    isTeacher: groups.includes("TEACHER"),
  };
};

/**
 * The signed-in user and their roles (Cognito groups). Role changes apply
 * from the user's next sign-in, when a new token is issued.
 */
export default function useCurrentUser() {
  const { data, isLoading } = useSWR("/auth/current-user", getCurrentUser);

  return { ...data, isLoading };
}
