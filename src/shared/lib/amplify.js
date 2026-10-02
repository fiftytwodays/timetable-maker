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
 * Builds create/update/delete functions for a model.
 */
export const createCrudApi = (modelName) => {
  const model = () => client.models[modelName];

  return {
    create: async (values) => toRecord(unwrap(await model().create(values))),
    update: async (id, values) =>
      toRecord(unwrap(await model().update({ id, ...values }))),
    remove: async (id) => unwrap(await model().delete({ id })),
  };
};

/**
 * Throws if the record still has related records through `relation`
 * (a hasMany field), so deleting it would leave dangling references.
 */
export const assertNotReferenced = async (modelName, id, relation, usedBy) => {
  const record = unwrap(
    await client.models[modelName].get(
      { id },
      { selectionSet: ["id", `${relation}.id`] }
    )
  );

  if (record?.[relation]?.length > 0) {
    throw new Error(`It is still used in ${usedBy}. Remove those first.`);
  }
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
