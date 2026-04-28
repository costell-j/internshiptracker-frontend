# Internship Tracker — Frontend

A React frontend for tracking internship applications. Built with Vite, Tailwind CSS, and Axios. Live and deployed on Vercel.

**Live App:** [internshiptracker-frontend.vercel.app](https://internshiptracker-frontend.vercel.app)  
**Backend Repo:** [github.com/costell-j/internshiptracker](https://github.com/costell-j/internshiptracker)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Deployment | Vercel |

---

## Features

- **Authentication** — register, login, and persistent sessions via localStorage
- **Protected routes** — unauthenticated users are redirected to login
- **Dashboard** — paginated application list with status badges and stats bar
- **Usage indicator** — progress bar showing free tier usage (30 application limit)
- **Upgrade flow** — Stripe checkout modal for Pro tier upgrade
- **Application detail** — CRM-style interaction timeline per application
- **Feedback modal** — bug reports and feature requests from any page
- **Dark mode UI** — consistent design system throughout

---

## Project Structure

```
src/
├── api/
│   └── axios.js          — configured Axios instance with JWT interceptor
├── components/
│   └── FeedbackModal.jsx  — reusable feedback modal
├── context/
│   └── AuthContext.jsx    — global auth state (token, user, tier)
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    └── ApplicationDetail.jsx
```

---

## Key Concepts

**Auth Context** — global state shared across all components via React Context API. Stores the JWT token and user info in localStorage so sessions persist across refreshes.

**Axios Interceptor** — automatically attaches the JWT token to every outgoing request so individual API calls don't need to handle auth manually.

**Protected Routes** — a `ProtectedRoute` wrapper component checks authentication before rendering any page. Unauthenticated users are redirected to `/login`.

**Tier-aware UI** — the dashboard reads the user's tier from context and shows either a usage progress bar (free) or a PRO badge (pro). The upgrade modal appears when the limit is hit or the upgrade button is clicked.

---

## Running Locally

### Prerequisites
- Node.js 18+
- The backend running at `http://localhost:8080`

### Setup

1. Clone the repo
```bash
git clone https://github.com/costell-j/internshiptracker-frontend.git
cd internshiptracker-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file
```
VITE_API_URL=http://localhost:8080
```

4. Start the dev server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`. The Vite proxy is configured to forward `/api` requests to `http://localhost:8080` automatically.

---

## Deployment

The frontend is deployed to Vercel. Every push to `main` triggers an automatic redeploy.

A `vercel.json` file handles client-side routing so page refreshes don't return 404:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The `VITE_API_URL` environment variable is set in the Vercel dashboard to point to the live Railway backend.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Author

**Costell Johnson**  
[LinkedIn](https://www.linkedin.com/in/costell-johnson-815778343) · [GitHub](https://github.com/costell-j)
