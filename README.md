# KrishiMitra AI: Crop Advisory Assistant
> AI-powered, multilingual, grounded agricultural advisory assistant for smallholder and commercial farmers.

---

## 1. System Architecture

```text
                                  +---------------------------------------+
                                  |         Farmer Client (React)         |
                                  | Vite, Tailwind CSS 3, React Router v6 |
                                  |      (360px mobile to desktop)        |
                                  +-------------------+-------------------+
                                                      |
                          Bearer JWT (Supabase Auth)  |  HTTP Requests
                                                      v
                                  +-------------------+-------------------+
                                  |      Express.js Backend API (Node)    |
                                  | Helmet, Rate Limiter, Multer, Zod     |
                                  +---------+-------------------+---------+
                                            |                   |
                        Forwarded JWT (RLS) |                   | Prompts + JSON Schemas
                                            v                   v
            +-------------------------------+---+   +-----------+-----------------------+
            |      Supabase (PostgreSQL)        |   |       Google Gemini AI            |
            | - Profiles (trigger auto-created) |   |    (@google/genai SDK)            |
            | - Farms (RLS protected)           |   | - Model: gemini-2.5-flash         |
            | - Advisories (Snapshot + Result)  |   | - Structured JSON Generation      |
            | - Messages (20-cap follow-ups)    |   | - 1 Automatic Repair Retry        |
            | - Feedback (Helpful/Unhelpful)    |   | - Vision / Leaf Image Analysis    |
            +-----------------------------------+   +-----------------------------------+
```

---

## 2. Key Features

1. **Farmer Authentication & Onboarding:** Email/password authentication, password recovery via Supabase Auth, and an onboarding gate ensuring location, language, and area units are configured.
2. **Farm Profile Management (CRUD):** Manage multiple farms with land size, soil type, pH, organic carbon, irrigation source, and water availability.
3. **5 Specialized Agronomic Advisory Engines:**
   - **Crop Recommendation:** Multi-criteria ranking for season, budget, rotation, and market access.
   - **Pest & Disease Diagnosis:** Field symptom chips + optional plant/leaf photo upload (JPEG/PNG/WebP <= 5 MB with magic byte verification), IPM-first biological/chemical remedies.
   - **Fertilizer & Nutrient Plan:** Split dosage schedules, organic alternatives, N-P-K ranges, and soil test recommendations.
   - **Irrigation & Water Plan:** Stage-wise timeline, critical yield-sensitive moisture stages, deficit irrigation strategies.
   - **Seasonal Crop Calendar:** Month-by-month task checklist from land preparation to post-harvest handling.
4. **Follow-Up Advisory Chat:** Context-grounded Q&A on any advisory, persistent history, capped at 20 questions with friendly notice.
5. **Advisory History & Search:** Debounced search (400ms), farm/type filtering, and pagination.
6. **Print & Text Export:** Formatted `@media print` stylesheet omitting navigation/chat, plus 1-click clipboard export.
7. **Feedback & Quality Loop:** Thumbs up/down rating with optional comments.
8. **Multilingual:** Full UI & AI advisory generation in English, Hindi (हिन्दी), and Marathi (मराठी).
9. **Privacy First ("Delete My Data"):** Complete cascading removal of all farm records, advisories, messages, and feedback.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Tailwind CSS 3, Axios, React Hook Form, Zod, Lucide React, React Hot Toast |
| **Backend** | Node.js 20+, Express.js 4 (ES Modules), Helmet, Cors, Morgan, Express Rate Limit, Multer (Memory Storage), Zod |
| **Database & Auth** | Supabase (PostgreSQL 15+ with Row Level Security and Triggers) |
| **AI Engine** | Google Gen AI SDK (`@google/genai`), Model `gemini-2.5-flash` |

---

## 4. Setup & Installation

### Prerequisites
- Node.js `20.x` or later
- npm `10.x` or later
- Supabase project account ([https://supabase.com](https://supabase.com))
- Google AI Studio API Key ([https://aistudio.google.com](https://aistudio.google.com))

### 1. Install Dependencies
From the repository root:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure Database (Supabase)
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run `supabase/migrations/001_init.sql` to create extensions, enums, tables, indexes, and triggers.
3. Run `supabase/migrations/002_rls.sql` to enable Row Level Security and configure user isolation policies.
4. In **Authentication -> URL Configuration**:
   - Set **Site URL** to `http://localhost:5173`
   - Add `http://localhost:5173/reset-password` to **Redirect URLs**.

### 3. Configure Environment Variables
Copy the templates:
```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

#### `server/.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

GEMINI_API_KEY=AIzaSy...your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

AI_DAILY_LIMIT_PER_USER=50
AI_RATE_LIMIT_WINDOW_MIN=10
AI_RATE_LIMIT_MAX=20
GENERAL_RATE_LIMIT_MAX=120
```

#### `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 5. Running the Application

### Start Development Server (Concurrently runs backend & frontend)
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

### Individual Services
```bash
npm run dev:server    # Starts Express API with file watching
npm run dev:client    # Starts Vite dev server
```

### Production Build & Secret Audit
```bash
npm run build         # Builds production client bundle
npm run check:secrets # Verifies no Gemini API keys or service_role keys leaked into client
```

---

## 6. Security & Safety Principles

1. **No Client-Side Secrets:** Gemini API keys and Supabase service-role keys are never sent to or bundled in the client application.
2. **Caller JWT Scoping (RLS):** Backend queries Supabase using the caller's JWT. PostgreSQL Row Level Security enforces that users can only access their own data. Cross-user access returns `404 Not Found` to prevent resource enumeration.
3. **Prompt Injection Defense:** Untrusted user input (`notes`, `symptom_description`, `recent_inputs`, follow-up chat) is sanitized and wrapped in `<user_input>...</user_input>` delimiters with explicit instructions for Gemini to treat content as data only.
4. **Image Magic-Byte Sniffing:** Uploaded diagnostic photos are verified in memory via magic-byte signatures (`image/jpeg`, `image/png`, `image/webp`). Files are never written to disk, and image bytes are never persisted.
5. **Agricultural Safety & IPM:**
   - AI outputs strictly enforce Integrated Pest Management (cultural -> mechanical -> biological -> chemical).
   - Chemical recommendations state active ingredients only with product label dosage caveats.
   - Live mandi rates, speculative yields, and weather forecasts are explicitly prohibited.
   - Persistent disclaimers urge verification with local Krishi Vigyan Kendras (KVKs).

---

## 7. Known Limitations & Architecture Decisions

1. **Soil Test Data:** If a farmer does not provide soil test values (N-P-K), the system supplies university-standard split schedules for the chosen soil type and highlights soil test recommendations.
2. **Diagnostic Images:** Images are analyzed in volatile memory by the model for visual symptoms and are discarded immediately after inference. Only `had_image: true` is persisted to protect farmer privacy and minimize storage costs.
3. **Follow-up Chat Window:** Follow-up questions are capped at 20 per advisory to prevent unbounded context growth and token exhaustion while encouraging farmers to generate updated advisories when conditions change.
