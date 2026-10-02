import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";

import outputs from "../../../amplify_outputs.json";

Amplify.configure(outputs);

export const client = generateClient();

const SORT_FIELDS = { created: "createdAt", updated: "updatedAt" };

/**
 * Returns the data of an Amplify Data response, throwing on GraphQL errors.
 */
export const unwrap = ({ data, errors }) => {
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }
  return data;
};

/**
 * Fetches every record of a model, following pagination tokens.
 */
export const listAll = async (model, options = {}) => {
  const items = [];
  let nextToken = null;

  do {
    const response = await model.list({ ...options, limit: 1000, nextToken });
    items.push(...unwrap(response));
    nextToken = response.nextToken;
  } while (nextToken);

  return items;
};

/**
 * Sorts records using PocketBase style sort strings, e.g. "name" or "-created".
 */
export const sortRecords = (records, sort = "created") => {
  const descending = sort.startsWith("-");
  const field = sort.replace(/^-/, "");
  const key = SORT_FIELDS[field] || field;
  const direction = descending ? -1 : 1;

  return [...records].sort(
    (a, b) => String(a?.[key] ?? "").localeCompare(String(b?.[key] ?? "")) * direction
  );
};

/**
 * Maps an Amplify record to the shape the UI was built around
 * (PocketBase's `created`/`updated` timestamps).
 */
export const toRecord = (item) =>
  item && {
    ...item,
    created: item.createdAt,
    updated: item.updatedAt,
  };
