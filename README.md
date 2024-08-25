# Project Name

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

You can run the application using the following methods
1. Plain next.js 
2. Tauri application

### Running as next.js application
Start PocketBase
Use the command below (for Linux):
```bash
cd src-tauri/data/pb && ./pocketbase serve
```
Use the command below (for Windows):
```bash
cd src-tauri/data/pb
pocketbase serve
```

Run the development server
```bash
npm run dev
```
Open http://localhost:3000/ with your browser to see the result.

### Running as tauri application
Please follow [Tauri Getting Started - Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for setting up tauri.

Run in development mode
```bash
npm run tauri dev
```
Run in production mode
```bash
npm run tauri build
```

Open http://localhost:8090/_/ with your browser to see the PocketBase console.
Username: admin@timetable.com
Password: timetableadmin

## PocketBase data backup and restore

