# CureConnect – Healthcare & Doctor Chamber Management

A full-fledged **front-end** for a healthcare management system with a **pharmaceutical-grade** look: **patient–doctor management** where doctors have specializations, manage their own chambers (locations and slot availability), and patients can browse doctors, see chamber locations and available slots, and book appointments.

## Features

### For patients
- **Register / login** as a patient
- **Browse doctors** by specialization (Cardiology, General Medicine, Orthopedics, Pediatrics, Dermatology, etc.)
- **View doctor profile**: chambers, addresses, slot timings, and available days
- **Book appointment**: pick a chamber → select date (only days the chamber is open) → choose an available time slot → confirm
- **My appointments**: view upcoming appointments and cancel if needed

### For doctors
- **Register / login** as a doctor
- **Edit profile**: qualification, bio, and **multiple specializations**
- **Manage chambers**: add multiple chambers with:
  - Name and address
  - Slot start/end time and slot duration (e.g. 15/20/30/45/60 min)
  - **Available days** (Mon–Sun)
- **View appointments**: upcoming and past patient bookings

## Tech stack

- **React 18** + **Vite**
- **React Router** for routing
- **Tailwind CSS** for styling
- **Context** for auth; in-memory store for data (ready to swap for a real API)

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

### Demo logins

| Role    | Email           | Password |
|--------|------------------|----------|
| Patient | patient@test.com | 123456   |
| Doctor  | doctor@test.com  | 123456   |

## Build

```bash
npm run build
npm run preview
```

## Project structure

- `src/context/AuthContext.jsx` – login, register, logout
- `src/services/api.js` – in-memory store (users, doctors, chambers, appointments)
- `src/services/slots.js` – slot generation for chamber time range
- `src/data/constants.js` – specializations, days, date helpers
- `src/data/seed.js` – initial data and `initStore()`
- `src/pages/` – Home, Login, Register; patient and doctor pages
- `src/components/Layout.jsx` – header, nav, footer

## Connecting a backend

Replace calls in `src/services/api.js` with `fetch`/axios to your API. Keep the same function names and return shapes so components need minimal changes. Run seed data from your backend or remove `src/data/seed.js` and load data from the API.
