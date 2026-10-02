import type { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminResetUserPasswordCommand,
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
};

type Arguments = {
  id?: string;
  email?: string;
  name?: string | null;
  role?: string;
  enabled?: boolean | null;
};

const client = new CognitoIdentityProviderClient();
const UserPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

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

const createUser = async ({ email, name, role }: Arguments) => {
  const validRole = assertRole(role);
  const created = await client.send(
    new AdminCreateUserCommand({
      UserPoolId,
      Username: email,
      DesiredDeliveryMediums: ["EMAIL"],
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        ...(name ? [{ Name: "name", Value: name }] : []),
      ],
    })
  );
  const Username = created.User!.Username!;
  await setRole(Username, validRole);
  return getUser(Username);
};

const updateUser = async ({ id, name, role, enabled }: Arguments) => {
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

// Invited users who never signed in get a new invitation; everyone else
// gets a password reset code by email.
const resetUserPassword = async ({ id }: Arguments) => {
  const user = await getUser(id!);
  if (user.status === "FORCE_CHANGE_PASSWORD") {
    await client.send(
      new AdminCreateUserCommand({
        UserPoolId,
        Username: user.email!,
        MessageAction: "RESEND",
        DesiredDeliveryMediums: ["EMAIL"],
      })
    );
  } else {
    await client.send(
      new AdminResetUserPasswordCommand({ UserPoolId, Username: user.id })
    );
  }
  return true;
};

// Stops an admin from locking themselves out.
const assertNotSelf = (event: AppSyncResolverEvent<Arguments>) => {
  const identity = event.identity as AppSyncIdentityCognito | null;
  const { id, role, enabled } = event.arguments;
  const isSelf = id === identity?.username || id === identity?.sub;
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
