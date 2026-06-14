# SkillBridge Client

The frontend for SkillBridge — a tutoring platform where students can find and book expert tutors.

Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + shadcn/ui
- **Auth** — Better Auth (client)
- **State** — React Server Components + client hooks
- **Package Manager** — pnpm

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- SkillBridge backend running on `http://localhost:5000`

---

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/skillbridge-client.git
cd skillbridge-client
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your `.env.local`:
```env
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
AUTH_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**4. Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (common)/         # Public pages (home, tutors, login, register)
│   └── (dashboard)/      # Protected dashboard pages (student, tutor, admin)
├── components/
│   ├── layout/           # Navbar, Footer, AppSidebar
│   ├── modules/          # Feature components (homepage, tutors, dashboard, admin)
│   └── ui/               # shadcn UI components
├── services/             # API service functions
├── types/                # TypeScript types
├── routes/               # Sidebar route definitions per role
├── lib/                  # Auth client and utilities
├── hooks/                # Custom React hooks
├── constants/            # App-wide constants
└── middleware.ts         # Route protection
```

---

## Features

- Browse and search tutors by subject, rating, and price
- View detailed tutor profiles with reviews
- Student — register, book sessions, manage bookings, leave reviews
- Tutor — manage profile, set availability, view sessions
- Admin — manage users, bookings, and categories
- Role-based dashboards for student, tutor, and admin
- Responsive design for mobile, tablet, and desktop
- Dark and light mode support


---

## Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```