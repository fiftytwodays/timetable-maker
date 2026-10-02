# Timetable maker

A [Next.js](https://nextjs.org/) application for building school timetables, backed by [AWS Amplify Gen 2](https://docs.amplify.aws/nextjs/):

- **Auth**: Amazon Cognito (username + password, email optional) with two roles, `ADMIN` and `TEACHER`. Self sign-up is disabled; admins create logins in the app.
- **User management**: a Lambda function ([amplify/functions/manage-users](amplify/functions/manage-users)) that admins call to list, create, update and delete Cognito users and to set temporary passwords.
- **Data**: AWS AppSync + Amazon DynamoDB, defined in [amplify/data/resource.ts](amplify/data/resource.ts).
- **Storage**: Amazon S3 for the school logo, defined in [amplify/storage/resource.ts](amplify/storage/resource.ts).
- **Hosting**: Amplify Hosting serves the static export (`out/`), as configured in [amplify.yml](amplify.yml).

## Prerequisites

- Node.js 18.17 or later
- An AWS account with credentials configured locally (`aws configure sso` or `aws configure`)

## Local development

Install dependencies:

```bash
npm install
```

Start a personal cloud sandbox. This deploys the backend to your AWS account and writes `amplify_outputs.json`, which the frontend needs:

```bash
npx ampx sandbox
```

In a second terminal, run the development server:

```bash
npm run dev
```

Open http://localhost:3000/ and sign in.

### Creating the first admin

Logins are managed in the app, which only admins can do, so the first admin is created from the command line. Use the user pool id from `amplify_outputs.json` (`auth.user_pool_id`), and choose a username and a temporary password (at least 8 characters with upper case, lower case, a number and a symbol):

```bash
aws cognito-idp admin-create-user   --user-pool-id <user-pool-id>   --username <username>   --temporary-password '<temporary-password>'   --message-action SUPPRESS

aws cognito-idp admin-add-user-to-group   --user-pool-id <user-pool-id>   --username <username>   --group-name ADMIN
```

Sign in with that username and temporary password; you are asked to choose a new password. Group changes take effect the next time the user signs in.

## Roles and logins

| Role | Can do |
| --- | --- |
| `ADMIN` | Everything: manage entities, associations, timetables, checklists and logins. |
| `TEACHER` | View the class, students and teachers timetables. |

Users sign in with a **username**. An email address is optional: if one is set, Cognito also emails the invitation and the user can reset their own password with "Forgot your password?".

When an admin creates a login or resets a password, the app generates a **temporary password and shows it once**, with a copy button, for the admin to hand over. The user must choose a new password at their next sign-in. If the temporary password is lost, reset the password again.

- **Teachers page**: the main place to manage logins. Each teacher has a **Login** column: **Give login access** (username, optional email, role), or **Manage** to edit the login, reset the password, or remove access while keeping the teacher. Deleting a teacher also deletes their login. A teacher can have the `ADMIN` role, for example the principal, so they can manage the app and also be assigned checklists.
- **Users page**: an overview of every login, including accounts that are not teachers (for example office staff). Logins can also be created, edited, linked to a teacher, reset and deleted here.

Admins cannot delete, disable or demote their own account.

## Managing data

The first time someone signs in to a new deployment, the app creates the initial school record, the days (Monday to Saturday) and the periods P1 to P4. Each table is only seeded while it is empty, so periods you later edit or delete are not recreated.

Teachers, subjects, classes and periods can be added, edited and deleted from their pages in the app. Period names must be P1 to P5, because the timetables have a column for each of those. A record that is still in use (for example, a teacher in a class–subject–teacher association, or a period in the timetable) cannot be deleted until those references are removed.

Class–subject–teacher associations and class-timetable entries can also be added, edited and deleted from their pages. Saving is refused if it would double-book a class or a teacher in the same day and period, and a class, subject and teacher can only be associated once.

On the **Checklists** page, admins create checklists: a title, a description, a frequency (daily, weekly or one-time), an ordered list of activities, and the teachers who must complete it. Deleting a teacher removes their checklist assignments.

## Deploying

1. Push this repository to GitHub (or another Git provider).
2. In the Amplify console, choose **Create new app** and connect the repository and branch.
3. Amplify picks up [amplify.yml](amplify.yml). Each push deploys the backend for that branch, then builds and hosts the frontend.

To remove a sandbox, run `npx ampx sandbox delete`.
