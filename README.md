# FructaVision

FructaVision is an AI-powered fruit quality analysis platform. It combines a React frontend, FastAPI backend inference service, and Supabase authentication/storage to identify fruit type, estimate freshness, and suggest shelf life.

## Highlights

- Fruit analysis from uploaded images or camera captures
- Freshness classification as Fresh, Ripe, or Overripe
- Shelf-life estimation based on fruit and freshness
- Google OAuth login with Supabase Auth
- Personal scan history and analytics dashboard
- Deploy-ready frontend configuration for Vercel

## Tech Stack

Frontend:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Supabase JS client

Backend:
- FastAPI
- TensorFlow (CPU)
- Pillow + NumPy

Data/Auth:
- Supabase Postgres + RLS
- Supabase OAuth (Google)

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── runtime.txt
├── src/
│   ├── components/
│   ├── contexts/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── lib/
├── supabase/
│   └── schema.sql
└── package.json
```

## How It Works

1. User signs in with Google through Supabase.
2. Frontend sends the selected image to the inference API.
3. Backend predicts fruit + freshness and returns confidence and shelf life.
4. Frontend stores each scan in Supabase under the authenticated user.
5. Analytics page reads user scans and displays trends.

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.11 (recommended for backend)
- A Supabase project (URL + anon/publishable key)

## Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file in the project root named .env.local:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional alternative key name supported by this project:
# VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key

# Optional: if using a hosted backend
# VITE_HF_SPACE_URL=https://your-space-url

# Optional: full analyze endpoint override (recommended for Vercel)
# VITE_API_ANALYZE_URL=https://your-backend-domain/api/analyze
# VITE_APP_URL=https://your-vercel-app.vercel.app
```

3. Run the frontend:

```bash
npm run dev
```

Frontend URL is shown in the Vite terminal output after startup.

## Backend Setup

1. Go to backend folder:

```bash
cd backend
```

2. Create and activate virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Place trained model files inside backend:

- fruit_model.h5
- freshness_model.h5

Important: backend/main.py expects these exact file names in backend root.

5. Start API server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

For deployment, configure one of these:
- VITE_API_ANALYZE_URL as a full endpoint URL (recommended)
- VITE_HF_SPACE_URL as backend base URL (app appends /api/analyze)

## Supabase Setup

1. Create a Supabase project.
2. Enable Google OAuth provider in Supabase Auth.
3. In Supabase SQL Editor, run the script from:

- supabase/schema.sql

This creates scans table, indexes, and RLS policies so users only access their own data.

## Available Scripts

From project root:

- npm run dev: Start Vite dev server
- npm run build: Type-check and build production bundle
- npm run preview: Preview production build
- npm run lint: Run ESLint

## Environment Variables Reference

Frontend:

- VITE_SUPABASE_URL: Supabase project URL
- VITE_SUPABASE_ANON_KEY: Supabase anon key
- VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: Alternate key variable (optional)
- VITE_API_ANALYZE_URL: Full backend analyze endpoint URL (optional, recommended)
- VITE_HF_SPACE_URL: Hosted backend base URL (optional)
- VITE_APP_URL: UI base URL for Supabase OAuth redirect (optional; defaults to window.location.origin)

Backend:

- PORT: API port for deployment (optional, defaults to 7860 in __main__)

## Deployment Notes

Frontend:

- Vercel is configured with SPA rewrites in vercel.json.
- Add all required VITE_* env vars in Vercel project settings.

Backend:

- Deploy backend separately (for example Hugging Face Spaces, Render, Railway, or similar).
- Ensure fruit_model.h5 and freshness_model.h5 are present at runtime.

## Troubleshooting

- Missing Supabase env error:
  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.

- API returns 503 models not loaded:
  Confirm backend/fruit_model.h5 and backend/freshness_model.h5 exist.

- CORS or network error:
  Verify frontend URL can reach backend URL and check browser network tab.

- OAuth sign-in not returning to app:
  Add correct redirect URLs in Supabase Auth settings.

## License

No license file is currently included. Add a LICENSE file if you plan to distribute this project publicly.
