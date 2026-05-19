# CreatorFlow AI

> An AI-powered platform that automates the pre-production workflow for content creators — generating professional YouTube thumbnails and fully structured video scripts in seconds.

![CreatorFlow AI](./client/public/logo.png)

## Demo Video
 **Overview**
![Demo](/client/public/assets/demo.gif)

## Project Screenshots
 **Home Page**
![Home Page](./client/public/assets/Home.png)

 **Thumbnail Generator**
![Thumbnail Generator](./client/public/assets/Thubnail.png)

 **Script Generator**
![Script Generator](./client/public/assets/Script.png)

 My Generations
![My Generations Dashboard](./client/public/assets/History.png)

 **My Profile**
![User Profile](./client/public/assets/Profile.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
  - [Auth Routes](#auth-routes)
  - [Thumbnail Routes](#thumbnail-routes)
  - [Script Routes](#script-routes)
  - [User Routes](#user-routes)
- [AI Integrations](#ai-integrations)
- [Database Schema](#database-schema)
- [Future Scope](#future-scope)

---

## Overview

**CreatorFlow AI** is a full-stack MERN-like web application built for YouTubers and digital content creators. It eliminates the creative bottleneck in pre-production by using a multi-model Generative AI pipeline to produce:

- **AI Thumbnails** — visually striking, style-guided background images optimised for YouTube CTR.
- **AI Scripts** — fully structured, JSON-driven video scripts with hooks, body content, statistics, and CTAs.

All generated content is saved to a personal dashboard where users can view, download, and manage their creations.

---

## Features

### AI Thumbnail Generator
- Input a video title, visual style (e.g., Bold & Graphic, Minimalist), colour scheme, and aspect ratio.
- A two-step AI pipeline enhances the raw title into a Stable Diffusion-optimised prompt (via Google Gemini), then renders the image (via Pollinations AI).
- Preview the thumbnail on a mocked YouTube interface before downloading.

### AI Script Generator
- Input a video topic, tone (e.g., Educational, Casual, Humorous), and desired length (Short / Medium / Long).
- Generates a fully structured JSON script with: **Hook → Intro → Main Content → Statistics → Outro → CTA**.
- Script is rendered in a clean, teleprompter-style panel in the UI.

### My Generations Dashboard
- A persistent library of all previously generated thumbnails and scripts.
- Supports downloading thumbnails and deleting any saved generation.

### Authentication
- Secure session-based auth with HTTP-only cookies.
- Protected routes on both the frontend (via `AuthContext`) and backend (via `protect` middleware).

---

## Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion (`motion`) | Animations & 3D tilt effects |
| React Router DOM v7 | Client-side routing |
| Lenis | Smooth scroll |
| Lucide React | Icon library |
| React Fast Marquee | Scrolling marquee elements |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 + TypeScript | REST API server |
| MongoDB + Mongoose | Database & ODM |
| `express-session` + `connect-mongo` | Session management |
| `bcrypt` | Password hashing |
| `@google/genai` (Gemini) | Prompt enhancement AI |
| `groq-sdk` (Llama 3) | Script generation AI |
| `cloudinary` | Media asset management |
| `tsx` + `nodemon` | TypeScript dev runner |

---

## Project Structure

```
CreatorFlow_AI/
├── package.json                  # Root — runs client & server concurrently
│
├── client/                       # React frontend
│   ├── index.html
│   ├── public/
│   │   ├── logo.png
│   │   └── assets/               # Static images & SVGs
│   └── src/
│       ├── main.tsx
│       ├── App.tsx               # Router setup
│       ├── globals.css
│       ├── assets/               # Asset imports (assets.ts)
│       ├── components/           # Reusable UI components
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── Login.tsx
│       │   ├── PreviewPanel.tsx
│       │   ├── ScriptPanel.tsx
│       │   ├── AspectRatioSelector.tsx
│       │   ├── ColorSchemeSelector.tsx
│       │   ├── StyleSelector.tsx
│       │   ├── TiltImage.tsx
│       │   ├── LenisScroll.tsx
│       │   ├── SectionTitle.tsx
│       │   └── SoftBackdrop.tsx
│       ├── context/
│       │   └── AuthContext.tsx   # Global auth state
│       ├── data/                 # Static data (nav, pricing, etc.)
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── Generate.tsx      # Main generation page
│       │   ├── MyGeneration.tsx  # User dashboard
│       │   ├── Profile.tsx
│       │   └── YtPreview.tsx
│       ├── sections/             # Landing page sections
│       │   ├── HeroSection.tsx
│       │   ├── FeaturesSection.tsx
│       │   └── ContentIdeasSection.tsx
│       └── types.ts
│
└── server/                       # Express backend
    ├── server.ts                 # App entry point
    ├── .env                      # Environment variables
    ├── configs/
    │   ├── db.ts                 # MongoDB connection
    │   ├── ai.ts                 # Gemini client config
    │   ├── cloudinary.ts         # Cloudinary config
    │   └── replicate.ts          # Replicate config
    ├── controllers/
    │   ├── AuthControllers.ts    # Register, Login, Logout
    │   ├── ThumbnailController.ts
    │   ├── ScriptController.ts
    │   └── UserController.ts
    ├── middlewares/
    │   └── auth.ts               # Session protection middleware
    ├── models/
    │   ├── User.ts
    │   ├── Thumbnail.ts
    │   └── Script.ts
    └── routes/
        ├── AuthRoutes.ts
        ├── ThumbnailRoutes.ts
        ├── ScriptRoutes.ts
        └── UserRoutes.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB** database (local or MongoDB Atlas)
- API keys for: **Google Gemini**, **Groq**, **Cloudinary**

### Installation

Clone the repository and install all dependencies with a single command from the root:

```bash
git clone https://github.com/your-username/creatorflow-ai.git
cd creatorflow-ai
npm run install-all
```

This installs dependencies for the root, `/client`, and `/server` simultaneously.

### Environment Variables

Create a `.env` file inside the `/server` directory with the following keys:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/thumblify

# Session
SESSION_SECRET=your_strong_random_secret

# Google Gemini (Prompt Engineering)
GEMINI_API_KEY=your_gemini_api_key

# Groq (Script Generation)
GROQ_API_KEY=your_groq_api_key

# Cloudinary (Media Storage)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Optional
PORT=3000
NODE_ENV=development
```


### Running the App

Start both the frontend and backend together from the root directory:

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Vite) | `http://localhost:5173` |
| Backend (Express) | `http://localhost:3000` |

To run them individually:

```bash
# Backend only
cd server && npm run server

# Frontend only
cd client && npm run dev
```

---

## API Reference

All API routes are prefixed with `/api`. Protected routes require an active session cookie.

### Auth Routes

**Base:** `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/login` | No | Log in and create a session |
| `GET` | `/verify` | Yes | Verify the current session |
| `POST` | `/logout` | Yes | Destroy the session |

**Register / Login Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

---

### Thumbnail Routes

**Base:** `/api/thumbnail`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | Yes | Generate a new AI thumbnail |
| `DELETE` | `/delete/:id` | Yes | Delete a thumbnail by ID |

**Generate Body:**
```json
{
  "title": "string",
  "style": "Bold & Graphic | Minimalist | Cinematic | ...",
  "color_scheme": "string",
  "aspect_ratio": "16:9 | 1:1 | 9:16"
}
```

---

### Script Routes

**Base:** `/api/script`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | Yes | Generate an AI video script |
| `GET` | `/user` | Yes | Fetch all scripts for the current user |
| `DELETE` | `/delete/:id` | Yes | Delete a script by ID |

**Generate Body:**
```json
{
  "topic": "string",
  "tone": "Educational | Casual | Humorous | Inspirational",
  "length": "Short | Medium | Long"
}
```

---

### User Routes

**Base:** `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/thumbnails` | Yes | Fetch all thumbnails for the current user |
| `GET` | `/thumbnail/:id` | Yes | Fetch a single thumbnail by ID |
| `GET` | `/profile` | Yes | Fetch the user's profile and usage stats |

---

## AI Integrations

### Google Gemini 2.0 Flash — Prompt Engineer
The user's plain-language video title (e.g., *"How to make a burger"*) is sent to Gemini with a strict system prompt. Gemini transforms it into a detailed, comma-separated Stable Diffusion prompt optimised for visual quality (e.g., *"juicy cheeseburger, flying ingredients, studio lighting, photorealistic, dark background, 8k"*).

### Pollinations AI — Image Renderer
The backend constructs a deterministic URL from the Gemini-enhanced prompt and aspect ratio. The URL is saved to the database and the client fetches the image directly, avoiding server memory overhead. No API key is required.

### Groq SDK — Script Writer (Llama 3.3 70B / Llama 3.1 8B)
Groq's ultra-low-latency inference is used to query Meta's Llama models with `response_format: { type: "json_object" }` enforced. This guarantees a structured JSON output with the keys: `hook`, `intro`, `main_content`, `statistics`, `outro`, `cta`.

A **fallback mechanism** is built in: if `llama-3.3-70b-versatile` is rate-limited, the server automatically retries with `llama-3.1-8b-instant`.

---

## Database Schema

### User
```ts
{
  name:      String (required)
  email:     String (required, unique)
  password:  String (required, hashed with bcrypt)
  createdAt: Date
}
```

### Thumbnail
```ts
{
  userId:       ObjectId → User
  title:        String
  prompt_used:  String
  style:        String
  aspect_ratio: String
  color_scheme: String
  image_url:    String
  createdAt:    Date
}
```

### Script
```ts
{
  userId:       ObjectId → User
  title:        String
  tone:         String
  length:       String
  hook:         String
  intro:        String
  main_content: String
  statistics:   String
  outro:        String
  cta:          String
  createdAt:    Date
}
```

---
