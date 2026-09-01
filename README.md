# RenewIQ — Subscription Management SaaS

React frontend for managing customers, subscriptions, billing, renewals & AI insights.

## Quick Start (VS Code)

```bash
# 1. Open this folder in VS Code
# 2. Open terminal and run:

npm install
npm run dev
```

Browser will open at `http://localhost:5173`

## Demo Login

- **Email:** `admin@fitpro.gym`
- **Password:** `demo123`

Or sign up a new business — data is multi-tenant (isolated per business).

## Features

- Login / Sign Up (multi-tenant)
- Dashboard (MRR, Revenue, Churn, charts)
- Customers CRUD
- Subscriptions + Auto-renew
- Plans (monthly / quarterly / yearly)
- Invoices (paid / pending / overdue)
- Upcoming Renewals
- Analytics
- AI Insights (heuristic)
- **Dark / Light theme toggle**
- Responsive (mobile sidebar)

## Project Structure

```
renewiq-react/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   ├── ThemeContext.jsx
    │   └── DataContext.jsx
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── Topbar.jsx
    │   ├── Modal.jsx
    │   ├── Toast.jsx
    │   ├── StatusBadge.jsx
    │   ├── CustomerForm.jsx
    │   ├── PlanForm.jsx
    │   └── SubscriptionForm.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   ├── Customers.jsx
    │   ├── Subscriptions.jsx
    │   ├── Plans.jsx
    │   ├── Invoices.jsx
    │   ├── Renewals.jsx
    │   ├── Analytics.jsx
    │   └── AIInsights.jsx
    └── utils/
        ├── helpers.js
        └── defaultData.js
```

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
```