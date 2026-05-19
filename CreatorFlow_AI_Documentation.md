# CreatorFlow AI: Comprehensive Technical Documentation

## 1. Abstract
**CreatorFlow AI** (formerly known as Thumblify) is an advanced, end-to-end web platform designed to automate and optimise the pre-production workflow for digital content creators. By integrating multiple state-of-the-art Generative AI models, the system autonomously generates highly engaging, SEO-optimised YouTube video scripts and high-conversion, visually striking thumbnails. This documentation details the system architecture, API integrations, frontend/backend modules, database schemas, and the overarching workflow.

---

## 2. Feature Explanation
CreatorFlow AI provides two primary features designed to eliminate the creative bottleneck for YouTubers:

1. **AI Thumbnail Generator**: 
   - Accepts a video title, desired visual style (e.g., Bold & Graphic, Minimalist), colour scheme, and aspect ratio.
   - Utilises a two-step AI pipeline (Prompt Enhancement + Image Generation) to produce professional-grade, text-free background visuals suitable for YouTube thumbnails.
   - Allows users to preview how the generated thumbnail will look natively on a mocked YouTube interface.

2. **AI Script Generator**:
   - Accepts a video topic, tone (e.g., Educational, Casual), and length constraint (Short, Medium, Long).
   - Generates a fully structured JSON script containing a Hook, Intro, Main Content, relevant Statistics, an Outro, and a Call-To-Action (CTA).

3. **Content Dashboard (My Generations)**:
   - A persistent library where authenticated users can view, manage, download, and delete their previously generated scripts and thumbnails.

---

## 3. System Architecture
The application follows a modern **Client-Server (MERN-like)** architecture, decoupled into a distinct Frontend Application and a RESTful Backend API.

- **Frontend (Client Layer)**: React.js (Vite), TypeScript, Tailwind CSS, Framer Motion. Responsible for UI state, form handling, and rich animations.
- **Backend (Server Layer)**: Node.js, Express.js, TypeScript. Acts as a secure proxy to external AI APIs and manages business logic.
- **Database (Data Layer)**: MongoDB (via Mongoose). Stores user profiles, generated script JSONs, and thumbnail metadata.
- **Authentication**: Stateful session management using `express-session` and secure HTTP-only cookies.

---

## 4. API Integrations (Generative AI)
The core intelligence of CreatorFlow AI relies on a carefully orchestrated ensemble of third-party Large Language Models (LLMs) and Image Generation APIs.

### 4.1. Google Gemini 2.0 Flash (Prompt Engineering)
- **Role**: Acts as an intermediary "Prompt Engineer".
- **Workflow**: User inputs a simple title (e.g., "Make Burger in 30 min"). The Node.js server sends this to Gemini with strict system instructions to convert it into a highly detailed, comma-separated, Stable-Diffusion-optimised image prompt (e.g., *"Juicy cheeseburger, flying ingredients, studio lighting, photorealistic, dark background, 8k"*).

### 4.2. Pollinations AI (Image Generation)
- **Role**: Renders the final thumbnail.
- **Workflow**: The backend takes the Gemini-enhanced prompt and constructs a deterministic URL for Pollinations AI (which wraps Stable Diffusion models). The URL is saved to the database, and the frontend directly fetches the rendered image from the URL, bypassing server-side memory limits.

### 4.3. Groq SDK (Llama 3.3 70B & Llama 3.1 8B)
- **Role**: Script writing.
- **Workflow**: Groq’s ultra-fast inference API is used to query Meta's Llama models. The backend enforces a strict `response_format: { type: "json_object" }` constraint, guaranteeing that the AI returns a perfectly structured script object containing the Hook, Intro, Body, etc., which can be seamlessly mapped to the React UI.

---

## 5. Workflow Execution
### 5.1. Thumbnail Generation Pipeline
1. **Client**: User fills out the generator form and clicks "Generate".
2. **Server**: Validates session and input.
3. **Server -> Gemini**: Sends metadata. Gemini returns a rich Stable Diffusion prompt.
4. **Server**: Constructs the `pollinations.ai` URL with the desired aspect ratio.
5. **Database**: Saves a new `Thumbnail` document containing the URL and user ID.
6. **Client**: Receives the URL and renders the image.

### 5.2. Script Generation Pipeline
1. **Client**: User inputs topic and length.
2. **Server**: Validates request.
3. **Server -> Groq**: Sends system instructions enforcing JSON output. Tries `llama-3.3-70b` first; falls back to `llama-3.1-8b` if rate-limited.
4. **Database**: Parses the JSON output and saves it as a structured `Script` document.
5. **Client**: Receives the script and maps the JSON keys to the visually segmented `ScriptPanel` component.

---

## 6. Frontend / Backend Modules

### 6.1. Frontend Modules (`/client`)
- **Routing**: `react-router-dom` handles navigation (`/`, `/generate`, `/my-generations`, `/login`).
- **Context API (`AuthContext.tsx`)**: Manages global user state, checking session validity on initial load.
- **UI Components**: Highly modularized.
  - `TiltImage.tsx`: Utilizes `framer-motion` to create a 3D perspective tilt effect on the hero video.
  - `ScriptPanel.tsx`: Formats the raw JSON script into a beautiful, readable teleprompter-style UI.
  - `PreviewPanel.tsx`: Displays the generated image and handles downloading/previewing.

### 6.2. Backend Modules (`/server`)
- **Middlewares (`auth.ts`)**: Intercepts requests to `/api/*` to verify `req.session.userId`. Rejects unauthorized requests.
- **Controllers**:
  - `AuthController.ts`: Handles Login/Register/Logout.
  - `ScriptController.ts`: Handles Groq API communication and JSON validation.
  - `ThumbnailController.ts`: Handles Gemini communication, fallback logic, and Pollinations URL formatting.
  - `UserController.ts`: Retrieves data specific to the authenticated user for the dashboard.

---

## 7. Database Schema (MongoDB)

### 7.1. User Model
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique)",
  "password": "String (Hashed)",
  "createdAt": "Date"
}
```

### 7.2. Thumbnail Model
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "title": "String",
  "prompt_used": "String",
  "style": "String",
  "aspect_ratio": "String",
  "color_scheme": "String",
  "image_url": "String",
  "createdAt": "Date"
}
```

### 7.3. Script Model
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "title": "String",
  "tone": "String",
  "length": "String",
  "hook": "String",
  "intro": "String",
  "main_content": "String",
  "statistics": "String",
  "outro": "String",
  "cta": "String",
  "createdAt": "Date"
}
```

---

## 8. UI / UX Explanation
- **Aesthetic**: The platform utilizes a "Dark Mode" premium aesthetic, heavy on subtle glassmorphism (backdrop blurs), glowing gradients (vibrant pinks and purples), and high-contrast typography to appeal to modern digital creators.
- **Animations**: `framer-motion` is used extensively for spring-based page transitions, hover states, and the Hero Section's interactive 3D video tilt effect.
- **Responsive Design**: Built mobile-first using Tailwind CSS. The dashboard converts from a grid to a stacked column layout on smaller screens.
- **State Management**: React state handles immediate feedback (e.g., loading skeletons while the AI generates content).

---

## 9. Future Scope
1. **Direct YouTube Integration**: Implement YouTube OAuth to allow users to directly upload generated thumbnails and scripts as video drafts to their channels.
2. **Text-Overlay Rendering**: Currently, thumbnails are text-free. Integrating an HTML Canvas or sharp.js backend module to programmatically overlay the video title onto the generated image in a stylised font.
3. **A/B Testing Module**: Allow the AI to generate 3 variations of a thumbnail and track Click-Through Rates (CTR) if integrated with YouTube analytics.
4. **Voiceover Generation**: Integrate a Text-To-Speech (TTS) API (like ElevenLabs) to automatically convert the generated JSON script into a downloadable audio track.
