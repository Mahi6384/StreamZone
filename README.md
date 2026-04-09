# InsightHire

InsightHire is a full-stack platform for sharing structured interview experiences — questions asked, prep notes, tips, and optional media — so candidates can prepare with confidence.

## Features

- **Structured sharing**: rounds, questions, notes, tips, and outcome
- **Media uploads (optional)**: images + video via Cloudinary
- **Auth**: email/password + Google ID-token sign-in
- **Community feedback**: helpful / not-helpful + discussion threads
- **Searchable feed**: filter by company, role, and experience level
- **Theme**: light/dark UI

## Tech stack

- **Frontend**: React (Create React App) + Tailwind CSS + DaisyUI
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Media**: Cloudinary

## Monorepo structure

- `frontend/` — React app
- `backend/` — Express API

## Local development

### 1) Backend

Create `backend/.env`:

```bash
MONGO_URI=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
```

Run:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 2) Frontend

Create `frontend/.env`:

```bash
REACT_APP_API_BASE=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=...
```

Run:

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`.

## Deployment notes

### Backend (Render)

- Set **`MONGO_URI`** and Cloudinary env vars in Render.
- If using MongoDB Atlas, ensure the cluster allows inbound connections from your deployment environment.

### Frontend (Vercel)

Set these Environment Variables in Vercel:

- `REACT_APP_API_BASE` = your backend base URL (example: `https://insighthire-cy69.onrender.com`)
- `REACT_APP_GOOGLE_CLIENT_ID` = your Google OAuth client id

