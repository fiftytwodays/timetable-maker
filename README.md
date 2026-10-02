# Timetable maker

A [Next.js](https://nextjs.org/) application for building school timetables, backed by [AWS Amplify Gen 2](https://docs.amplify.aws/nextjs/):

- **Auth**: Amazon Cognito (email + password). Self sign-up is disabled; an administrator creates users.
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

### Creating a user

Self sign-up is disabled, so create users in the Cognito console (**Amplify console → your app → Authentication → Users**), or with the AWS CLI:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <user-pool-id from amplify_outputs.json> \
  --username someone@example.com \
  --user-attributes Name=email,Value=someone@example.com Name=email_verified,Value=true
```

The user is asked to set a new password the first time they sign in.

## Managing data

The first time someone signs in to a new deployment, the app creates the initial school record, the days (Monday to Saturday) and the periods P1 to P4. Each table is only seeded while it is empty, so periods you later edit or delete are not recreated.

Teachers, subjects, classes and periods can be added, edited and deleted from their pages in the app. Period names must be P1 to P5, because the timetables have a column for each of those. A record that is still in use (for example, a teacher in a class–subject–teacher association, or a period in the timetable) cannot be deleted until those references are removed.

Class–subject–teacher associations and class-timetable entries can also be added, edited and deleted from their pages. Saving is refused if it would double-book a class or a teacher in the same day and period, and a class, subject and teacher can only be associated once.

## Deploying

1. Push this repository to GitHub (or another Git provider).
2. In the Amplify console, choose **Create new app** and connect the repository and branch.
3. Amplify picks up [amplify.yml](amplify.yml). Each push deploys the backend for that branch, then builds and hosts the frontend.

To remove a sandbox, run `npx ampx sandbox delete`.
