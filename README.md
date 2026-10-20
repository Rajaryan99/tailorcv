<div align="center">

# TailorCV

**Paste a job description. Upload your resume. Get a personalized interview strategy.**

An AI-powered full-stack app that analyzes a target job against your profile and builds a custom interview plan: likely questions, skill gaps, a match score, and a prep roadmap.

[**Live Demo**](https://tailorcv-beta.vercel.app) 

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=googlegemini&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

---

## Why TailorCV?

Generic interview prep lists don't know your background or the role you're applying for. TailorCV reads **both** the job description and your resume, then generates questions grounded in *your* actual projects and the *gaps* between you and the role.

## Screenshots

| Home | Interview Report |
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/793d32c0-6c0e-4333-9c88-df506b9a8100" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/dc5841ea-e3f6-4bbd-adaa-f99f928b31d5" />




## Features

- **Job-aware analysis:** paste any job description (up to 5000 characters).
- **Resume upload:** PDF or DOCX (max 5MB), or a quick self-description if you don't have a resume handy.
- **Match score:** how well your profile fits the role, at a glance.
- **Skill gap detection:** the technologies and concepts the role wants that your profile lacks.
- **Technical questions:** questions tied to your own projects and the job's stack.
- **Behavioral questions:** a separate set for the non-technical round.
- **Prep roadmap:** a step-by-step plan to close your gaps.
- **Tailored resume download:** export a resume adjusted for the target role.
- **Report history:** past reports saved to your account, with delete.
- **Secure auth:** JWT-based signup and login.

## How It Works

Think of it as a coach who reads your resume and the job posting side by side, then asks: "What will they probe, and where are you weak?"

```
Resume (PDF/DOCX) ──► Text extraction ──► Gemini embeddings ─┐
                                                              ├─► Retrieve relevant
Job description ─────► Gemini embeddings ────────────────────┘   resume context
                                                                       │
                                                                       ▼
                                          Gemini API generates a structured report:
                                          match score · skill gaps · questions · roadmap
```

1. The resume is parsed to text and the job description is taken as input.
2. Both are converted to vectors with the **Gemini embedding model**.
3. **RAG** retrieves the resume sections most relevant to the job, so the model works from your real experience instead of guessing.
4. The **Gemini API** generates a structured report, validated before being saved to MongoDB.
5. The frontend renders it as tabs: Technical, Behavioral, and Roadmap.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, SCSS, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API, Gemini embedding model, RAG |
| Auth | JWT, bcrypt, cookie-parser |
| File handling | Multer, pdf-parse |
| Validation | Zod |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
tailorcv/
├── frontend/        # React + SCSS client
│   └── src/
└── backend/         # Express API
    ├── app.js
    └── ...
```

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/Rajaryan99/REPO_NAME.git
cd REPO_NAME
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

## Deployment

| Part | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory: `frontend` |
| Backend | Render | Root directory: `backend`, build: `npm install`, start: `npm start` |

Set the same environment variables in each dashboard, and point `CLIENT_URL` at the deployed frontend so CORS allows it.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/interview` | Generate a report from a job description + resume |
| GET | `/api/interview` | List your past reports |
| GET | `/api/interview/:id` | Get one report |
| DELETE | `/api/interview/:id` | Delete a report |

## Roadmap

- [ ] More resume templates for the tailored download
- [ ] Mock interview mode with answer feedback
- [ ] Export report as PDF
- [ ] Save multiple profiles per user

## Challenges & Learnings

- Making LLM output reliable by requesting structured JSON and validating it with Zod.
- Grounding answers with RAG so questions reference the candidate's real projects.
- Deploying a split frontend/backend: CORS, environment variables, and production start scripts.

## Author

**Raj Aryan Singh**

- GitHub: [@Rajaryan99](https://github.com/Rajaryan99)
- Portfolio: [my-dev-showcase-rho.vercel.app](https://my-dev-showcase-rho.vercel.app/)

---

<div align="center">

If you found this useful, consider giving the repo a star.

</div>
