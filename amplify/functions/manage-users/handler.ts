import { randomInt } from "node:crypto";
import type { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserAttributesCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
  type AttributeType,
  type UserType,
} from "@aws-sdk/client-cognito-identity-provider";

export const ROLES = ["ADMIN", "TEACHER"] as const;
type Role = (typeof ROLES)[number];

type User = {
  id: string;
  sub: string | null;
  email: string | null;
  name: string | null;
  role: Role | null;
  enabled: boolean;
  status: string | null;
  createdAt: string | null;
  temporaryPassword?: string;
};

type Arguments = {
  id?: string;
  username?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  enabled?: boolean | null;
};

const client = new CognitoIdentityProviderClient();
const UserPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,64}$/;

// Ambiguous characters (0/O, 1/l/I) are left out so the password is easy to
// read out or copy by hand.
const PASSWORD_CHARACTERS = [
  "ABCDEFGHJKLMNPQRSTUVWXYZ",
  "abcdefghijkmnopqrstuvwxyz",
  "23456789",
  "!@#$%&*?",
];

/** A random password meeting the pool policy: upper, lower, digit, symbol. */
const generatePassword = (length = 12) => {
  const pick = (characters: string) => characters[randomInt(characters.length)];
  const all = PASSWORD_CHARACTERS.join("");
  const characters = [
    ...PASSWORD_CHARACTERS.map(pick),
    ...Array.from({ length: length - PASSWORD_CHARACTERS.length }, () =>
      pick(all)
    ),
  ];
  // Shuffle so the required character types are not always first.
  for (let i = characters.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
  return characters.join("");
};

const attribute = (attributes: AttributeType[] | undefined, name: string) =>
  attributes?.find((attr) => attr.Name === name)?.Value ?? null;

const toUser = (
  user: UserType,
  roles: Map<string, Role>,
  attributes = user.Attributes
): User => ({
  id: user.Username!,
  sub: attribute(attributes, "sub"),
  email: attribute(attributes, "email"),
  name: attribute(attributes, "name"),
  role: roles.get(user.Username!) ?? null,
  enabled: user.Enabled ?? true,
  status: user.UserStatus ?? null,
  createdAt: user.UserCreateDate?.toISOString() ?? null,
});

const assertRole = (role: string | undefined): Role => {
  if (!ROLES.includes(role as Role)) {
    throw new Error(`Role must be one of ${ROLES.join(", ")}`);
  }
  return role as Role;
};

const listGroupMembers = async (role: Role) => {
  const usernames: string[] = [];
  let NextToken: string | undefined;
  do {
    const page = await client.send(
      new ListUsersInGroupCommand({ UserPoolId, GroupName: role, NextToken })
    );
    usernames.push(...(page.Users ?? []).map((user) => user.Username!));
    NextToken = page.NextToken;
  } while (NextToken);
  return usernames;
};

const getRoles = async () => {
  const roles = new Map<string, Role>();
  for (const role of ROLES) {
    for (const username of await listGroupMembers(role)) {
      // ADMIN is listed first and wins if a user is somehow in both groups.
      if (!roles.has(username)) {
        roles.set(username, role);
      }
    }
  }
  return roles;
};

const setRole = async (Username: string, role: Role) => {
  await Promise.all(
    ROLES.filter((other) => other !== role).map((other) =>
      client.send(
        new AdminRemoveUserFromGroupCommand({
          UserPoolId,
          Username,
          GroupName: other,
        })
      )
    )
  );
  await client.send(
    new AdminAddUserToGroupCommand({ UserPoolId, Username, GroupName: role })
  );
};

const setEmail = async (Username: string, email: string | null) => {
  if (email) {
    await client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId,
        Username,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "email_verified", Value: "true" },
        ],
      })
    );
  } else {
    await client.send(
      new AdminDeleteUserAttributesCommand({
        UserPoolId,
        Username,
        UserAttributeNames: ["email"],
      })
    );
  }
};

const getUser = async (Username: string) => {
  const user = await client.send(
    new AdminGetUserCommand({ UserPoolId, Username })
  );
  const roles = await getRoles();
  return toUser(
    {
      Username: user.Username,
      Enabled: user.Enabled,
      UserStatus: user.UserStatus,
      UserCreateDate: user.UserCreateDate,
    },
    roles,
    user.UserAttributes
  );
};

const listUsers = async () => {
  const users: UserType[] = [];
  let PaginationToken: string | undefined;
  do {
    const page = await client.send(
      new ListUsersCommand({ UserPoolId, PaginationToken })
    );
    users.push(...(page.Users ?? []));
    PaginationToken = page.PaginationToken;
  } while (PaginationToken);

  const roles = await getRoles();
  return users.map((user) => toUser(user, roles));
};

// The temporary password is returned once so the admin can hand it over.
// If the user has an email, Cognito also emails them the invitation.
const createUser = async ({ username, email, name, role }: Arguments) => {
  const validRole = assertRole(role);
  if (!username || !USERNAME_PATTERN.test(username)) {
    throw new Error(
      "Username must be 3 to 64 letters, numbers, dots, hyphens or underscores."
    );
  }
  const temporaryPassword = generatePassword();

  await client.send(
    new AdminCreateUserCommand({
      UserPoolId,
      Username: username,
      TemporaryPassword: temporaryPassword,
      ...(email
        ? { DesiredDeliveryMediums: ["EMAIL"] }
        : { MessageAction: "SUPPRESS" }),
      UserAttributes: [
        ...(email
          ? [
              { Name: "email", Value: email },
              { Name: "email_verified", Value: "true" },
            ]
          : []),
        ...(name ? [{ Name: "name", Value: name }] : []),
      ],
    })
  );
  await setRole(username, validRole);
  return { ...(await getUser(username)), temporaryPassword };
};

const updateUser = async ({ id, email, name, role, enabled }: Arguments) => {
  const Username = id!;
  if (name !== undefined) {
    await client.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId,
        Username,
        UserAttributes: [{ Name: "name", Value: name ?? "" }],
      })
    );
  }
  if (email !== undefined) {
    await setEmail(Username, email || null);
  }
  if (role) {
    await setRole(Username, assertRole(role));
  }
  if (enabled === true) {
    await client.send(new AdminEnableUserCommand({ UserPoolId, Username }));
  } else if (enabled === false) {
    await client.send(new AdminDisableUserCommand({ UserPoolId, Username }));
  }
  return getUser(Username);
};

const deleteUser = async ({ id }: Arguments) => {
  await client.send(new AdminDeleteUserCommand({ UserPoolId, Username: id }));
  return true;
};

// Sets a new temporary password, which the user must change at next sign-in.
const resetUserPassword = async ({ id }: Arguments) => {
  const temporaryPassword = generatePassword();
  await client.send(
    new AdminSetUserPasswordCommand({
      UserPoolId,
      Username: id,
      Password: temporaryPassword,
      Permanent: false,
    })
  );
  return temporaryPassword;
};

// Stops an admin from locking themselves out.
const assertNotSelf = (event: AppSyncResolverEvent<Arguments>) => {
  const identity = event.identity as AppSyncIdentityCognito | null;
  const { id, role, enabled } = event.arguments;
  const isSelf =
    id !== undefined && (id === identity?.username || id === identity?.sub);
  if (!isSelf) {
    return;
  }
  if (event.info.fieldName === "deleteUser") {
    throw new Error("You cannot delete your own account.");
  }
  if (enabled === false) {
    throw new Error("You cannot disable your own account.");
  }
  if (role && role !== "ADMIN") {
    throw new Error("You cannot remove your own admin role.");
  }
};

const operations: Record<string, (args: Arguments) => Promise<unknown>> = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
};

export const handler = async (event: AppSyncResolverEvent<Arguments>) => {
  const operation = operations[event.info.fieldName];
  if (!operation) {
    throw new Error(`Unknown operation ${event.info.fieldName}`);
  }
  assertNotSelf(event);
  return operation(event.arguments);
};
