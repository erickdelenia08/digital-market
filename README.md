# 🚀 Premium Next.js 16 Starter Kit

A production-ready, feature-rich Next.js starter kit designed for speed, security, and aesthetics. Built with the latest technologies to provide a seamless development experience for modern web applications.

## ✨ Features

### 🔐 Robust Authentication (NextAuth v5)
- **Credential Login/Register**: Secure email and password authentication.
- **Two-Factor Authentication (2FA)**: Support for TOTP (authenticator apps).
- **Password Reset**: Full email-based reset flow.
- **Secure Sessions**: JWT strategy with optimized synchronization.

### 🏠 Modern Dashboard
- **Responsive Sidebar**: Collapsible, mobile-friendly navigation with active state tracking.
- **Dynamic Breadcrumbs**: Automatic breadcrumb generation based on route structure.
- **Data Tables**: Powerful, sortable, and searchable tables using TanStack Table.

### ⚙️ User Settings & Profile
- **Profile Management**: Update name and avatar.
- **Image Uploads**: Path-based storage with automatic cleanup of old assets.
- **Security Settings**: dedicated password update interface with strict validation.

### 🧪 Professional Testing Suite
- **Vitest Integration**: Blazing fast unit and integration tests.
- **Action Testing**: Comprehensive testing for Server Actions (Auth, Settings).
- **Mocking Layer**: Standardized Prisma and Auth mocks for isolated testing.
- **Verbose Reporting**: Detailed test output for clear development feedback.

### 🎨 Premium UI/UX
- **Shadcn UI**: Beautiful, accessible components out of the box.
- **Tailwind CSS 4**: The latest in utility-first styling.
- **Dark Mode Support**: Seamless transition between light and dark themes.
- **Optimized Typography**: Professional Geist font integration.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Database**: [Prisma 7+](https://www.prisma.io/) (MySQL/MariaDB)
- **Auth**: [NextAuth.js v5 (Beta)](https://authjs.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: [TanStack Query 5+](https://tanstack.com/query)
- **Frontend Library**: [React 19+](https://react.dev/)
- **Testing**: [Vitest 4+](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- MySQL or MariaDB instance

### 2. Installation
```bash
git clone <your-repo-url>
cd nextjs-starter
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure the following:

```env
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Acme Inc"

# Database
DATABASE_URL="mysql://user:password@localhost:3306/nextjs_starter"

# Authentication
AUTH_SECRET="your-secret-here" # Generate with: npx auth secret

# Mail (SMTP)
MAIL_HOST="your-smtp-host"
MAIL_PORT=2525
MAIL_USER="your-user"
MAIL_PASSWORD="your-password"
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="Support Team"
```

### 4. Database Initialization
Reset the database (if needed) and run migrations:

```bash
# Reset and apply migrations
npx prisma migrate dev --name init

# Seed initial data (Admin User)
npx prisma db seed
```

Default Admin Credentials:
- **Email**: `admin@example.com`
- **Password**: `password`

---

## 💻 Development

### Run Local Server
```bash
npm run dev
```

### Run Tests
```bash
# Run all tests with verbose output
npm test
```

### Prisma Studio
```bash
npx prisma studio
```

---

## 📁 Project Structure

```text
├── app/               # Next.js App Router (Pages & Actions)
│   ├── (auth)/        # Authentication routes
│   ├── api/           # API Route Handlers
│   ├── dashboard/     # Dashboard protected routes
│   └── actions/       # Server Actions (Business Logic)
├── components/        # Reusable UI components
├── lib/               # Shared utilities & configurations
├── prisma/            # Database schema & migrations
├── schemas/           # Zod validation schemas
├── tests/             # Vitest integration tests
└── public/            # Static assets & uploads
```

---

## 📦 Example CRUD Management

This project comes with a fully functional **Article CRUD** example that can be added or removed with a single command. This is useful for learning the patterns of this starter kit or starting with a completely clean base.

### Add Example CRUD
```bash
npm run crud-example:add
```

### Remove Example CRUD (Clean Base)
```bash
npm run crud-example:remove
```

---
## 🎓 Learning & Mastery

This starter kit includes a built-in **Skill** for AI assistants (like Antigravity) to help you build new features. 

To initialize the learning resources, run:

```bash
npm run setup-skills
```

This sets up the **CRUD Mastery** skill in the `.agents/skills/` directory. You can ask your AI assistant to "Read the CRUD Mastery skill" to get step-by-step guidance and templates for building your own features.

---

## 📄 License
This project is licensed under the MIT License.
