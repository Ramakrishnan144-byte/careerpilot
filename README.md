# 🎓 CareerPilot — AI-Powered Student Career, Internship & Placement Intelligence Platform

> **A production-ready, full-stack intelligence platform empowering university students, placement cells (TPOs), recruiters, and college deans.**

---

## 🌟 Executive Summary & Features

CareerPilot solves the fragmented, stressful, and non-transparent college placement process by unifying **deterministic academic eligibility enforcement**, **transparent multi-factor recommendation scoring**, **AI-driven career preparation tools**, and **collaborative campus recruitment workflows** into a single modern SaaS application.

### 1. Transparent Priority Score Model (0–100%)
No opaque AI black boxes. Every student receives a weighted recommendation score computed using:
* **Skill Match (35%):** Exact & semantic matching against required vs preferred technical competencies.
* **Academic Eligibility (25%):** CGPA cutoff compliance, active backlogs allowance, and department clearance.
* **Resume ATS Match (20%):** Keyword density, role relevance, and structural clarity.
* **Location & Work Mode (10%):** On-site, hybrid, or remote geographic preference alignment.
* **Experience & Projects (10%):** Prior internships and verified capstone portfolio projects.

### 2. Deterministic Eligibility Enforcer
* Validates minimum CGPA cutoffs, maximum active backlogs, approved department codes (`CSE`, `IT`, `AI_DS`, `ECE`, `EE`, `ME`, `CIVIL`, `MBA`), and graduation batches (`2025`, `2026`, `2027`).
* Clearly marks candidate state as `ELIGIBLE` (Green), `VERIFY_REQUIRED` (Yellow), or `NOT_ELIGIBLE` (Red) with specific reason strings.

### 3. Comprehensive Student Career Engine
* **Skill Gap Analyzer:** Audits missing technical skills for target roles and links curated tutorials, certifications, and practice projects.
* **9-Phase Personal Career Roadmap:** Interactive step-by-step milestone progression from profile baseline to final placement offer.
* **AI Resume & ATS Matcher:** Analyzes Plaintext/Markdown/PDF resume text against live job descriptions, highlights missing keywords, and recommends bullet improvements.
* **AI Mock Interview Simulator:** Generates role and company-specific technical, behavioral, HR, and situational questions. Provides rubric evaluations across 4 criteria (Relevance, Clarity, Technical Depth, Communication).
* **Career Readiness Score:** 7-dimension index (0–100) assessing skills, projects, certifications, internships, mock scores, and profile completeness with an actionable points checklist.
* **Smart Deadlines & Urgency Tracker:** Color-coded countdown alerts (`URGENT` ≤ 3d, `REMINDER` 4–7d, `INFO` > 7d).
* **Complementary Team Finder:** Discovers classmates with complementary skill stacks for capstones and hackathons.
* **Verified Digital Student Profile & QR Pass:** Public verified credentials preview at `/p/[slug]` with live QR code generation for mobile recruiter scanning.
* **Side-by-Side Company Comparison:** Compares compensation, eligibility cutoffs, work mode, and match score across 2–4 recruiters.
* **Skill-Tailored Project Recommender:** Suggests portfolio ideas filtered by difficulty (Beginner, Intermediate, Advanced).

### 4. Recruiter & Employer Command Center
* **Opportunity & Policy Builder:** Create campus drives with customizable CTC packages, selection stages, and deterministic eligibility rules.
* **Ranked Candidate Talent Pool:** Pre-ranked applicant list sorted by Priority Score match and academic status.
* **Pipeline Transitions:** Advance candidates through `APPLIED` → `ASSESSMENT` → `INTERVIEW` → `SHORTLISTED` → `SELECTED` / `REJECTED` with automated notifications.
* **Recruiter Analytics:** Application funnel conversion and applicant skill distribution charts.

### 5. University Placement Cell (TPO) Command Center
* **Institutional Placement Analytics:** Real-time departmental placement rates, CTC distribution, and skill demand metrics powered by Recharts.
* **Master Directories:** Institutional roster of all students, partner companies, and campus drives with CSV export.
* **Campus Broadcast Notifications:** Dispatch instant announcements and deadline alerts campus-wide or targeted by department.

---

## 🛠️ Technology Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, Server Components & Route Handlers) |
| **Language** | TypeScript 5.4+ (Strict mode, zero `any` leaks) |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Custom Reusable UI Kit |
| **Charts & Visuals** | Recharts (Placement conversion, salary tiers, applicant funnel) |
| **ORM & Database** | Prisma ORM 5.11+ with SQLite (Zero-friction local dev) / PostgreSQL compatible |
| **Authentication** | JWT via HTTP-only Cookies & BCryptJS Password Hashing |
| **AI Integration** | Modular Provider Pattern: Deterministic Fallback Provider + Google Gemini 2.5 Flash Adapter (`@google/genai`) |
| **QR Code & Confetti**| `qrcode` (SVG/Canvas) + `canvas-confetti` |
| **Testing** | Vitest unit test suite (14 passing tests) |

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
* Node.js 18.x or 20.x+
* npm, pnpm, or yarn

### 2. Installation
```bash
# Navigate to the project directory
cd careerpilot

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```
Default `.env` settings (fully functional offline):
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="careerpilot-super-secret-jwt-key-production-grade"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# Optional: Provide GEMINI_API_KEY to switch from deterministic mock provider to live Gemini 2.5 Flash
# GEMINI_API_KEY=""
```

### 4. Database Setup & Seeding
```bash
# Push schema to SQLite database
npx prisma db push

# Seed realistic demo data (10+ companies, 20+ opportunities, 8 departments, 50+ skills, 6 demo accounts)
npm run prisma:seed
```

### 5. Running the Application
```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Test Drive)

You can sign in immediately using the **1-Click Fast Test Drive toolbar** at the top of the page, on the `/login` page, or by using these credentials (password: `password123` for all accounts):

| Role | Name | Email | Focus / Department |
|---|---|---|---|
| 🎓 **Student** | Alex Rivera | `alex.student@careerpilot.edu` | CSE (SDE Track, 8.85 CGPA) |
| 📊 **Student** | Sarah Chen | `sarah.data@careerpilot.edu` | AI & DS (Data Science Track, 9.10 CGPA) |
| ⚡ **Student** | Priya Sharma | `priya.ece@careerpilot.edu` | ECE (Embedded Systems Track, 8.40 CGPA) |
| 🏢 **Recruiter** | David Miller | `talent@google.demo` | Google Campus Hiring Lead |
| 💼 **Recruiter** | Rajesh Gupta | `hiring@tcs.demo` | TCS Campus Recruitment Lead |
| 🏛️ **Placement Officer** | Dr. Robert Vance | `placement.dean@careerpilot.edu` | University Training & Placement Dean |

---

## 🧪 Testing & Verification

Run the automated Vitest test suite covering deterministic eligibility rules, multi-factor priority scoring, skill gap extraction, career score weighting, and deadline urgency:
```bash
# Run unit tests
npm test

# Typecheck all TypeScript code
npm run typecheck

# Build for production
npm run build
```

---

## 📁 Repository Directory Structure

```
careerpilot/
├── prisma/
│   ├── dev.db                 # SQLite local database
│   ├── schema.prisma          # 25 normalized database models
│   └── seed.ts                # Database seeding script
├── src/
│   ├── app/                   # Next.js App Router (Public, Student, Recruiter, Admin, API)
│   │   ├── api/               # 22 RESTful API route handlers
│   │   ├── student/           # 18 Student portal pages
│   │   ├── recruiter/         # 6 Recruiter portal pages
│   │   ├── admin/             # 9 Admin / TPO portal pages
│   │   ├── p/[slug]/          # Verified Digital Student Profile & QR Pass
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # UI kit (Badge, Button, Card, Modal, Tabs, ProgressBar, ScoreRing)
│   │   ├── charts/            # Recharts components (PlacementRate, SkillDemand, Salary, Funnel)
│   │   └── layout/            # Navbar, Footer, DemoSwitcher, Student/Recruiter/Admin Sidebars
│   ├── lib/                   # Database singleton, auth hashing & JWT, utils
│   └── services/              # Pure calculation services & AI abstractions
│       ├── ai/                # AIFactory, DeterministicMockAIProvider, GeminiAIProvider
│       ├── eligibility.service.ts
│       ├── scoring.service.ts
│       ├── skill-gap.service.ts
│       ├── career-score.service.ts
│       ├── roadmap.service.ts
│       ├── resume.service.ts
│       ├── interview.service.ts
│       ├── deadline.service.ts
│       ├── team-matching.service.ts
│       └── project-recommender.service.ts
└── tests/                     # Vitest automated test files
```

---

## 📄 License
This project is licensed under the MIT License.
