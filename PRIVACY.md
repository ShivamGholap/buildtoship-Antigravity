# KrishiMitra AI - Privacy Policy & Data Handling

## 1. Introduction
KrishiMitra AI ("we", "our", or "the Service") is an AI-powered agriculture advisory assistant designed to empower farmers with personalized crop, disease, fertilizer, irrigation, and seasonal calendar guidance. We are committed to transparency, data minimization, and user privacy.

## 2. Information We Collect
To provide accurate agronomic recommendations, we collect and store:
- **Account Details:** Email address, password hash (managed securely via Supabase Auth), full name, state, district, phone number (optional), preferred language (English, Hindi, Marathi), and preferred area unit (acres or hectares).
- **Farm Profile Data:** Farm name, location (state & district), land size, soil type, soil pH, organic carbon level, irrigation source, water availability, current/previous crops, and optional agronomy notes.
- **Advisory Requests & Results:** Input parameters for advisory queries (e.g., season, observed symptoms, fertilizer preferences), AI-generated guidance, follow-up chat messages, and feedback (helpful/not helpful ratings and comments).
- **Diagnostic Images:** Images uploaded for pest and disease diagnosis are processed in volatile memory only for inference via the Google Gen AI API and **are never written to disk or permanently stored**. Only a boolean flag (`had_image = true`) is stored in the database.

## 3. How We Use Your Information
- To deliver context-aware, grounded agricultural advisories tailored to your specific farm characteristics.
- To maintain your advisory history and allow continuous follow-up Q&A on past advisories.
- To respect user rate limits and prevent abuse.
- We **never sell, rent, or monetize** your personal or farm data.

## 4. Third-Party Services & Data Flow
- **Supabase (PostgreSQL & Auth):** Stores user profile, farm records, advisory history, follow-up messages, and feedback under strict Row Level Security (RLS). All queries run under the authenticated user's JWT.
- **Google Gemini API (`@google/genai`):** Processes farm snapshots, user advisory inputs, and diagnostic images to generate agronomic guidance. Prompts are sanitized and delimited using `<user_input>` tags to protect against prompt injection. Gemini API keys and Supabase service-role keys are strictly kept server-side and never exposed to the client.

## 5. Row Level Security & Data Isolation
Every database table enforces Row Level Security (RLS) in PostgreSQL. Each authenticated user has access **only** to their own profile, farms, advisories, chat messages, and feedback. Unauthorized access across users is blocked at the database level and returns 404/403.

## 6. Data Retention & "Delete My Data"
You have complete control over your data.
- **Delete Single Farm/Advisory:** You can delete any farm or advisory directly from the interface at any time.
- **Delete All Data ("Delete My Data"):** Available on the `/profile` page. Triggering this action permanently deletes your profile, all registered farms, all advisories, all chat messages, and all feedback in a single cascading operation, followed by account sign-out.

## 7. Security Best Practices
- Strict transport security with Helmet headers, CORS restrictions, and JSON payload caps (100 KB).
- Magic-byte validation on all image uploads (JPEG/PNG/WebP, max 5 MB).
- No sensitive keys or tokens are stored in the client application bundle.

## 8. Contact & Questions
For privacy concerns or assistance, please reach out to your local Krishi Vigyan Kendra (KVK) or the KrishiMitra AI system administrator.
