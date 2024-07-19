export default async function fetchFromBackend({ path, req, params = null }) {
  const response = await fetch(
    `${process.env.BACKEND_URL}${path}${
      params ? `?${new URLSearchParams(params)}` : ""
    }`,
    {
      headers: {
        Authorization: req.headers.authorization,
      },
    }
  );
  const responseObj = await response.json();
  return responseObj;
}
