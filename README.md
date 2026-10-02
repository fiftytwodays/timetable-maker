# Timetable maker

A [Next.js](https://nextjs.org/) application for building school timetables, backed by [AWS Amplify Gen 2](https://docs.amplify.aws/nextjs/):

- **Auth**: Amazon Cognito (email + password) with two roles, `ADMIN` and `TEACHER`. Self sign-up is disabled; admins create users in the app.
- **User management**: a Lambda function ([amplify/functions/manage-users](amplify/functions/manage-users)) that admins call to list, invite, update and delete Cognito users.
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

Users are managed from the **Users** page, which only admins can open, so the first admin is created from the command line. Use the user pool id from `amplify_outputs.json` (`auth.user_pool_id`):

```bash
aws cognito-idp admin-create-user   --user-pool-id <user-pool-id>   --username you@example.com   --user-attributes Name=email,Value=you@example.com Name=email_verified,Value=true

aws cognito-idp admin-add-user-to-group   --user-pool-id <user-pool-id>   --username you@example.com   --group-name ADMIN
```

The user is asked to set a new password the first time they sign in. Skip the first command if the user already exists. Group changes take effect the next time the user signs in.

## Roles and users

| Role | Can do |
| --- | --- |
| `ADMIN` | Everything: manage entities, associations, timetables, checklists and users. |
| `TEACHER` | View the class, students and teachers timetables. |

On the **Users** page, admins can invite a user (Cognito emails a temporary password), change their name, role or enabled status, resend the invitation or reset their password, and delete them. Admins cannot delete, disable or demote their own account.

A user can be linked to a teacher record, whatever their role. This is how the app knows which timetable and checklists belong to the person signed in; for example, a principal can be an `ADMIN` who is also linked to their teacher record so they can be assigned checklists. The linked login appears in the **Login** column on the Teachers page.

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
