## Product Rental Tracker (Demo)

A lightweight demo showing how to track products, create rentals, and view insights in a modern dashboard. It highlights clean UI, simple flows, and a Firebase-backed data model.

### What this demo shows
- **Dashboard overview**: KPIs, charts, and overdue alerts.
- **Products**: Add, edit, view status, and locations.
- **Rentals**: Create new rentals, return items, and track due dates.
- **Filters & insights**: Quick filters plus charts for trends and distribution.

### Tech stack
- **Next.js (App Router)** + **React 19**
- **Tailwind CSS v4** for styling
- **Firebase** (Auth + Firestore)
- **Zustand** for lightweight state
- **React Hook Form + Zod** for forms/validation
- **Recharts** for simple data visualizations

### Quick start
1) Install dependencies
```bash
npm install
```
2) Start the app
```bash
npm run dev
```
3) Open the demo at http://localhost:3000

Optional: To persist data, add Firebase web config to your environment (e.g. `.env.local`):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Navigation
- `Dashboard` → KPIs, charts, overdue alerts
- `Products` → list, create, and edit products
- `Rentals` → list and create rentals; mark returns

### Notes
- This is a demo focused on UX and flow; it is not production-hardened.
- Firebase deploy config is included for convenience; local demo works without deploying.
