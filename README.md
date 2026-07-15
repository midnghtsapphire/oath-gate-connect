# Ordain.Church - Complete Spiritual Platform


<!-- AUTO-PACKAGE-BADGES:START -->

<!-- AUTO-PACKAGE-BADGES:END -->
**Fully functional ordination and marriage ceremony platform with real backend, authentication, AI ceremony generation, and certificate management.**

## 🚀 Features - ALL WORKING

### ✅ Authentication
- Email/Password registration and login
- Google OAuth Sign-In with callback
- Apple Sign-In integration  
- JWT token-based session management
- Secure password hashing with bcrypt

### ✅ Backend (REAL AND FUNCTIONAL)
- PostgreSQL/SQLite database with real tables
- User accounts, profiles, saved ceremonies, certificates
- 50-state marriage law database API (complete data)
- AI Ceremony Builder via OpenRouter API
- Digital Certificate Generation with QR codes
- QR Verification System for certificates
- Stripe payment integration (dual test/live mode)

### ✅ Frontend (CONNECTED TO BACKEND)
- Every button, form, and feature connected to real APIs
- Marriage law search returns real results
- Ceremony builder generates real AI ceremonies
- Certificate generator produces real downloadable PDFs
- Dashboard shows real user data

### ✅ Accessibility
- WCAG AAA mode
- ADHD/neurodivergent mode
- Dyslexic mode

## 🛠️ Tech Stack

**Backend:** FastAPI, SQLAlchemy, SQLite/PostgreSQL, JWT, OpenRouter, Stripe, ReportLab, QRCode  
**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui

## 📦 Quick Start

### 1. Install Dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### 2. Configure Environment

Create `.env` file:
```bash
OPENROUTER_API_KEY=your_key_here
DATABASE_URL=sqlite:///./ordainchurch.db
JWT_SECRET=your-secret-key
APP_URL=http://localhost:8001
```

### 3. Initialize Database

```bash
python3 -c "from server.database import init_db; init_db()"
```

### 4. Build & Run

```bash
# Build frontend
npm run build

# Run backend (serves frontend automatically)
cd server
uvicorn main:app --host 0.0.0.0 --port 8001
```

Visit: `http://localhost:8001`

## 📡 API Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/apple`  
**Marriage Laws:** `/api/marriage-laws/all`, `/api/marriage-laws/{state}`  
**Ceremonies:** `/api/ceremony-builder/generate`, `/api/ceremony-builder/my-ceremonies`  
**Certificates:** `/api/certificates/ordination/generate`, `/api/certificates/verify/{id}`  
**Billing:** `/api/billing/create-checkout-session`, `/api/billing/subscription`

Full API docs: `http://localhost:8001/docs`

## 🗄️ Database Schema

- **users**: id, email, hashed_password, google_id, apple_id, ordination_date
- **subscriptions**: user_id, tier, stripe_customer_id, status
- **ceremony_scripts**: user_id, title, content, partner names, traditions
- **certificates**: certificate_id, type, verification_url, pdf_path

## 🔐 Security

- JWT tokens, bcrypt hashing, CORS configured
- OAuth flows for Google & Apple
- QR code certificate verification

## 🚢 Deployment

Works on DigitalOcean, Heroku, AWS, Google Cloud, Docker

## 📄 License

Private - All rights reserved

---

**Built for Ordain.Church - Celebrating all love, all faiths, all people.**

---

## Test

| Feature | Status |
|---------|--------|
| Feature | ✅ Ready |

