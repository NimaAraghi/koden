# Koden

A modern blogging platform built for developers to write, share, and manage technical content. Koden features full-stack functionality with authentication, a powerful markdown editor, and image uploads. Media management is handled by Uploadthing, while Auth.js provides secure authentication with both OAuth (Google, GitHub) and credentials.

[Live Preview 🚀](https://koden-two.vercel.app/)

---

## Features

- ✍️ Write posts with a modern markdown editor (MDXEditor)
- 🖼️ Upload images with [Uploadthing](https://uploadthing.com/)
- 🔐 Authentication via Google, GitHub, or credentials (Auth.js)
- 📑 Manage posts and user profile
- 🗄️ Full-stack with Neon, PostgreSQL & Drizzle ORM
- 💨 Fast, responsive design (Tailwind CSS, Next.js 15)

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Neon + PostgreSQL + Drizzle ORM
- **Authentication:** Auth.js (Google, GitHub, Credentials)
- **Media Upload:** Uploadthing
- **Editor:** MDXEditor
- **Validation:** Zod
- **Forms:** React Hook Form

---

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/NimaAraghi/koden.git
   cd koden
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file and add your database, Uploadthing, Auth.js, and OAuth provider keys. Example:

   ```env
   DATABASE_URL=your_postgres_url
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   AUTH_SECRET=your_authjs_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Run database migrations (if required)**

   ```bash
   npx drizzle-kit push
   ```

5. **Start the app**
   ```bash
   npm run dev
   ```

---

> Built with ❤️ using Next.js, Drizzle ORM, Neon, and Uploadthing.
