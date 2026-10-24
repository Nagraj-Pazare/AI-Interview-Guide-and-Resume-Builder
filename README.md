# 🤖 AI Interview Guide & Resume Builder

A full-stack AI-powered web application that analyzes your resume and a target job description to generate a **personalized interview strategy**, **technical & behavioral questions**, **skill gap analysis**, and a **downloadable tailored resume PDF**.

Live Demo → **[View on Netlify](https://tubular-klepon-903685.netlify.app)**

---

## ✨ Features

- 📄 **Resume PDF Upload** — Upload your existing resume for AI analysis
- 🎯 **Job Description Matching** — Paste any job description to get a match score
- 🧠 **AI Interview Strategy** — Get personalized technical & behavioral questions with model answers
- 📊 **Skill Gap Analysis** — Identify missing skills with severity levels (Low / Medium / High)
- 🗺️ **Day-by-Day Preparation Roadmap** — Structured plan to get interview-ready
- 📥 **AI Resume Generator** — Generate a tailored, ATS-friendly resume PDF in one click
- 🔐 **JWT Authentication** — Secure login & register with HTTP-only cookies

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| React Router 8 | Client-side Routing |
| Axios | HTTP Requests |
| SCSS | Styling |
| Vite | Build Tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API Server |
| MongoDB + Mongoose | Database |
| Google Gemini AI (`@google/genai`) | AI Report & Resume Generation |
| Puppeteer | HTML → PDF Conversion |
| pdf-parse | PDF Text Extraction |
| JWT + bcryptjs | Authentication |
| Multer | File Upload Handling |

---

## 🏗️ Project Structure

```
AI-Interview-Guide-and-Resume-Builder/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth & file middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API route definitions
│   │   └── services/        # AI & PDF generation logic
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── features/
    │   │   ├── auth/        # Login, Register, Protected routes
    │   │   └── interview/   # Home, Interview report, Navbar
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── netlify.toml
    └── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Google Gemini API key → [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/Nagraj-Pazare/AI-Interview-Guide-and-Resume-Builder.git
cd AI-Interview-Guide-and-Resume-Builder
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder (see `.env.example`):
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
PORT=3000
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` folder:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## ☁️ Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | [Netlify](https://netlify.com) | Set `VITE_API_URL` env variable |
| Backend | [Render](https://render.com) | Deploy as **Docker** service for Puppeteer support |

### Backend Environment Variables (Render)
| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | A long random secret string |
| `GOOGLE_GENAI_API_KEY` | Your Gemini API key |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `FRONTEND_URL` | Your Netlify site URL |

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login with email & password |
| POST | `/logout` | Public | Logout and blacklist token |
| GET | `/get-me` | Private | Get logged-in user details |

### Interview Routes (`/api/interview`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Private | Generate new interview report |
| GET | `/` | Private | Get all user reports |
| GET | `/report/:interviewId` | Private | Get single report by ID |
| POST | `/resume/pdf/:interviewReportId` | Private | Generate tailored resume PDF |

---

## 🔒 Security Features

- Passwords hashed with `bcryptjs`
- JWT tokens stored in `HttpOnly` cookies (`SameSite=None; Secure`)
- Token blacklisting on logout
- CORS restricted to known origins
- File upload size limited to 3MB

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Nagraj Pazare**
- GitHub: [@Nagraj-Pazare](https://github.com/Nagraj-Pazare)
