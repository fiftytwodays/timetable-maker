import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function useFetchFromApiRoute(
  url,
  params,
  condition = true,
  options = {}
) {
  const { data: session, status } = useSession();

  const { data, error, isLoading, mutate } = useSWR(
    status === "authenticated" && condition
      ? [
          `${url}${params ? `?${new URLSearchParams(params)}` : ""}`,
          session?.accessToken,
        ]
      : null,
    ([url, token]) => fetchWithToken(`${process.env.basePath}${url}`, token),
    options
  );

  return {
    data,
    isLoading,
    isError: error,
    refetchData: mutate,
  };
}

const fetchWithToken = async (url, token) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};
