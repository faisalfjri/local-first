# Todo App - Local-First

Local-first application using Next.js (using the App Router), Prisma (with MySQL) and Dexie (for local IndexedDB storage)

## Getting Started

copy the `.env.example` file to `.env`

```
DATABASE_URL="mysql://root:123456@localhost:3306/todos"
```

Install dependencies

```bash
npm install
```

Migrate init database

```
npx prisma migrate dev --name init
```

To start the application...

```
npm start
```

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
