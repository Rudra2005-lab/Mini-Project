<div align="center">
  <img src="./client/public/logo.svg" alt="SkillSpring Logo" width="120" height="120" />
  <h1>SkillSpring</h1>
  <p><strong>Your Personal Growth Cockpit & AI-Powered Skill Dashboard</strong></p>

  <p>
    <a href="#features">Features</a> • 
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#project-structure">Architecture</a> • 
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 🌟 Overview

**SkillSpring** is a full-stack skill mapping and growth tracking application. It features a motion-led landing page, a personalized dashboard for tracking capabilities and roadmaps, and an Express API that supports MongoDB storage with comprehensive local in-memory fallbacks. 

It turns abstract career goals into concrete, actionable daily tasks wrapped in a beautiful, gamified dashboard featuring heavy focus on **motion**, **glassmorphism**, and **fluid responsiveness**.

---

## ✨ Key Features

- **🎯 Precision Gap Analysis:** Select a target role (e.g., Frontend Developer, Data Scientist) and instantly see a comprehensive breakdown of your missing skills via dynamic Radar Charts and Gap Matrices.
- **🛣️ AI-Generated Roadmaps:** Generate custom 4–12 week learning timelines via Server-Sent Events (SSE) streaming with actionable tasks, calculated study hours, and resource recommendations.
- **🤖 Context-Aware AI Coach:** Chat with an interactive AI bot that knows your current skill tree, your target role, and your exact gaps to offer personalized advice and quizzes.
- **🔥 Gamification & Streaks:** Maintain a daily study streak (visualized via an interactive heatmap calendar grid), track upcoming milestones, and unlock system badges.
- **✨ Premium Visual Aesthetic:** Built with `Framer Motion` spring animations, native Lenis smooth-scrolling, custom CSS glass-card hover lifts, and ambient floating background orbs.
- **🔌 Offline-Ready Resiliency:** Designed so that the frontend gracefully degrades to local mock state, and the backend defaults to deterministic AI responses and in-memory DBs if keys or MongoDB are absent.

---

## 🛠 Tech Stack

SkillSpring is built on a modern, robust full-stack architecture:

### Frontend
- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State:** [Zustand](https://github.com/pmndrs/zustand)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) + [Lenis](https://lenis.studiofreight.com/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) + Custom Glassmorphism CSS utilities
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Core:** Node.js + Express 4
- **Database:** MongoDB + Mongoose
- **AI Processing:** OpenAI GPT-4o proxy streaming via SSE

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) and npm installed. MongoDB is optional but required for persistent storage.

### 1. Installation

```bash
# Install dependencies for both client and server (if set up)
npm install
```

### 2. Environment Setup

Copy the example env file and add your `MONGODB_URI` or `OPENAI_API_KEY` (optional).
```bash
cp .env.example .env
```

### 3. Start Database (Optional)
If you want persistent storage, spin up MongoDB:
```bash
mongod --dbpath ./data/db
```
*(Note: If MongoDB is offline, the backend falls back to an in-memory store automatically).*

### 4. Start Application
```bash
npm run dev
```
The frontend SPA runs on `http://localhost:5173` and the backend API runs on `http://localhost:5000`.

---

## 📁 Project Structure

```text
client/                 # React SPA
  ├── public/           # Static assets
  └── src/
      ├── animations/   # Framer Motion unified animation presets
      ├── components/   # Core dashboard and landing UI
      ├── context/      # React Context (Auth State)
      ├── pages/        # Lazy-loaded top-level routes
      └── store/        # Zustand global state
server/                 # Express API
  ├── controllers/      # Route controllers and request handlers
  ├── models/           # Mongoose schemas
  ├── services/         # ChatGPT orchestration, Parsing logic
  └── routes/           # Express API endpoints
```

## 🔌 Important Routes

- **Skills:** `GET`, `POST`, `PUT`, `DELETE` at `/api/skills`
- **Imports:** `POST /api/skills/parse-resume`, `POST /api/skills/import-github`
- **Roadmap:** `GET /api/roadmap`, `POST /api/roadmap/generate` (streams SSE)
- **AI Integration:** `POST /api/ai/chat` (streams SSE), `POST /api/ai/analyze-gaps`

## 🛠 Development Notes

- Authentication is intentionally lightweight/bypassed locally. A mock `local-dev` user is injected on both client and server during development.
- AI roadmap and chat routes stream dynamically. If `OPENAI_API_KEY` is not configured, the server responds with robust, deterministic mock streaming.
- Run `npm run lint` and `npm run format` locally to maintain code health.

<div align="center">
  <p>Built with ❤️ and continuous growth in mind.</p>
</div>
