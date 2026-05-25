# 🚀 AI Assessment Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Queue-red?style=for-the-badge&logo=redis)
![BullMQ](https://img.shields.io/badge/BullMQ-Background%20Jobs-orange?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-LLM%20Generation-purple?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/WebSocket-Realtime-black?style=for-the-badge&logo=socketdotio)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?style=for-the-badge&logo=tailwindcss)

### AI-powered academic assessment creation platform built for educators

Generate structured assignments using AI with real-time progress tracking, background job processing, persistent storage, and a polished teacher dashboard experience.

</div>

---

# 📌 Overview

**AI Assessment Generator** is a full-stack educational platform designed to simplify and automate the process of assessment creation for educators.

Instead of manually drafting question papers, balancing marks distribution, and formatting structured sections, instructors can provide:

- syllabus/topic context
- custom instructions
- uploaded learning material
- number of questions
- marks distribution

The platform then intelligently generates a **structured academic assessment** using an LLM pipeline and renders it in a polished, exportable format.

The system is intentionally designed around an **asynchronous architecture**, ensuring heavy AI processing does not block the application UI.

---

# ✨ Key Highlights

### 🎯 Figma-Accurate Frontend
The application UI closely replicates the provided design specification with high visual fidelity, including:

- layout hierarchy
- typography consistency
- spacing accuracy
- responsive behavior
- interaction polish

---

### ⚡ Real-Time AI Assignment Generation

Generate structured assessments powered by AI with:

- question grouping
- section generation
- difficulty tagging
- marks allocation
- instruction formatting

---

### 🔄 Event-Driven Background Processing

Heavy AI generation runs asynchronously using:

```txt
BullMQ + Redis
```

This prevents:

❌ UI freezing  
❌ request blocking  
❌ timeout failures

while keeping the user experience smooth.

---

### 📡 Real-Time Updates via WebSockets

Users receive live updates while assignments are being generated.

Example states:

```txt
✓ Assignment Created
✓ Processing Input
⏳ Generating Questions
⌛ Structuring Assessment
✓ Completed
```

No manual refresh required.

---

### 📚 Assignment Persistence & Archive

Generated assessments are:

✅ persisted to database  
✅ accessible after refresh  
✅ shareable via routes  
✅ visible in dashboard history

---

### 🔐 Lightweight Authentication System

The platform includes a **Custom Session / Context Authentication layer** for:

- login
- signup
- protected routes
- user-aware dashboards
- session persistence
- logout handling

---

# 🧩 Core Features

## 1. AI Assignment Creation

Educators can configure:

- assignment description
- custom instructions
- uploaded resources/images
- due date
- number of questions
- marks distribution
- question difficulty balancing

The system transforms instructor intent into structured academic content.

---

## 2. Structured Question Paper Generation

The platform avoids raw LLM rendering.

Instead, the AI response is parsed into a deterministic JSON schema:

```json
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Define Newton's First Law.",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}
```

This ensures:

- predictable rendering
- structured formatting
- UI stability
- extensibility

---

## 3. Dynamic Assessment Rendering

Generated assignments are rendered dynamically with:

### Student Information Section

- Name
- Roll Number
- Section

### Question Sections

Each section includes:

- title
- instructions
- grouped questions
- marks
- difficulty indicators

---

## 4. Export System

Generated assessments can be exported for downstream academic use.

Supports:

- structured document formatting
- printable output
- reusable question paper layouts

---

## 5. Dashboard Workspace

The dashboard acts as the instructor command center.

Includes:

### 📊 Dashboard Home
- recent assignments
- quick access cards
- activity tracking
- recent generation history

### 📝 Assignments View
- all generated assignments
- assignment archive
- quick open actions

### 🧠 AI Teacher Toolkit
Includes AI-powered educator workflows:

- Generate Assignment
- Generate MCQ Quiz
- Difficulty Balancer
- Bloom's Taxonomy Suggestions
- Question Formatter

### 📚 Library
Persistent archive of generated content.

### 👥 My Groups
Classroom/group organization interface.

---

# 🏗️ System Architecture

The application follows an **event-driven asynchronous architecture**.

Instead of generating assessments directly inside API requests, processing is delegated to a queue-based worker system.

## High-Level Architecture

```txt
User Interface
        │
        ▼
Next.js Frontend
        │
        ▼
API Route Layer
        │
        ▼
BullMQ Queue
        │
        ▼
Redis Job Store
        │
        ▼
Background Worker
        │
        ▼
Groq LLM Engine
        │
        ▼
Structured JSON Parsing
        │
        ▼
MongoDB Persistence
        │
        ▼
WebSocket Event Broadcast
        │
        ▼
Frontend Live Update
```

---

## Why This Architecture?

Traditional synchronous AI systems often suffer from:

```txt
Long loading times
Timeout failures
UI freezing
Poor scalability
```

This platform solves that by:

### Queue-Based Processing

AI generation runs in isolated background workers.

Benefits:

✅ non-blocking UI  
✅ scalable architecture  
✅ resilient task handling  
✅ better reliability

---

### Real-Time Event Updates

Instead of polling:

```txt
"Is generation done?"
```

the server pushes updates instantly using WebSockets.

Benefits:

✅ lower latency  
✅ smoother UX  
✅ reduced server overhead

---

### Persistent Database Layer

All generated assignments are stored in MongoDB.

Benefits:

✅ refresh-safe  
✅ shareable routes  
✅ archive system  
✅ future analytics support

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|----------|
| Next.js App Router | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling system |
| React Context | Session/Auth management |
| Socket.io | Real-time UI updates |

---

## Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Server runtime |
| Express | API layer |
| BullMQ | Background processing |
| Redis | Queue broker |
| MongoDB | Persistent storage |
| Groq API | LLM generation |

---

## Infrastructure

| Technology | Purpose |
|------------|----------|
| Vercel | Frontend deployment |
| MongoDB Atlas | Cloud database |
| Redis Cloud / Upstash | Redis hosting |
| Railway / Render | Backend deployment |

---

# 🧠 System Design Principles

The platform was built around several engineering principles:

## 1. Separation of Concerns

Frontend rendering, backend processing, and AI generation are fully decoupled.

```txt
UI Layer
↓
API Layer
↓
Queue Layer
↓
Worker Layer
↓
Database Layer
```

Benefits:

- maintainability
- scalability
- easier debugging

---

## 2. Asynchronous Processing

AI generation is intentionally removed from the request lifecycle.

Instead of:

```txt
Request → AI → Response
```

The system uses:

```txt
Request
↓
Queue
↓
Worker
↓
Database
↓
WebSocket Update
```

Benefits:

- responsiveness
- fault tolerance
- scalability

---

## 3. Modular Architecture

Reusable components and isolated concerns reduce coupling.

Examples:

- dashboard layouts
- auth provider
- queue workers
- websocket handlers
- generation services

---

## 4. Resilient Rendering

The frontend dynamically renders structured AI responses rather than unsafe raw text rendering.

This improves:

- consistency
- UI predictability
- rendering safety


# 🔄 Implementation Flows

The platform follows a highly decoupled event-driven workflow to ensure responsiveness, scalability, and resilience.

---

# 🔐 Authentication Flow

The platform uses a **Custom Session / Context Authentication Architecture**.

Instead of relying on third-party authentication providers, authentication is handled through a centralized React Context provider.

This approach keeps the implementation lightweight while still supporting:

- login
- signup
- session persistence
- protected routes
- authenticated dashboards
- logout handling

---

## Authentication Lifecycle

```txt
Visitor
   │
   ▼
Public Route
(/login or /signup)
   │
   ▼
Authentication Success
   │
   ▼
Session Stored in Context
   │
   ▼
Protected Dashboard Access
   │
   ▼
Authenticated User Experience
```

---

## Route Protection Strategy

Protected dashboard routes are guarded using a client-side authentication layer.

Example route groups:

```txt
/login
/signup

/dashboard
/assignments
/create
/library
/groups
/profile
```

Behavior:

### Authenticated User

```txt
User Session Found
        │
        ▼
Dashboard Access Granted
```

### Unauthenticated User

```txt
No Session Found
        │
        ▼
Redirect to /login
```

---

## Why Custom Context Authentication?

The project intentionally uses **Custom Session / Context Auth** instead of heavier authentication frameworks.

### Benefits

✅ lightweight implementation  
✅ minimal setup overhead  
✅ fast development iteration  
✅ protected route handling  
✅ session persistence  
✅ reusable global user state

---

# ⚙️ Assignment Generation Flow

The assignment generation system is the core workflow of the platform.

The process is intentionally designed to remain asynchronous and non-blocking.

---

## End-to-End Lifecycle

```txt
Educator Input
      │
      ▼
Client Validation
      │
      ▼
API Request
      │
      ▼
BullMQ Queue
      │
      ▼
Redis Job Broker
      │
      ▼
Background Worker
      │
      ▼
Groq LLM Generation
      │
      ▼
JSON Parsing
      │
      ▼
MongoDB Storage
      │
      ▼
WebSocket Event
      │
      ▼
Frontend UI Update
```

---

## Step-by-Step Flow

### 1. Instructor Configuration

The educator configures assignment parameters.

Supported inputs:

- assignment description
- custom instructions
- uploaded content/images
- due date
- question count
- marks distribution

---

### 2. Client-Side Validation

Before submission, the frontend validates:

```txt
Question count > 0
Marks > 0
Valid instructions
Required fields exist
```

This prevents malformed payloads.

---

### 3. API Request

Once validated:

Frontend issues:

```http
POST /api/assignments/generate
```

The request payload contains:

```json
{
  "description": "",
  "instructions": "",
  "questionCount": 5,
  "totalMarks": 20
}
```

---

### 4. Queue Delegation

Instead of waiting for AI generation inline:

The request is delegated to:

```txt
BullMQ Queue
```

Benefits:

✅ no request timeout  
✅ scalable workload handling  
✅ non-blocking architecture

---

### 5. Worker Processing

A background worker picks up the queued task.

Responsibilities:

- prepare structured prompts
- inject user context
- call Groq API
- validate response
- handle parsing

---

### 6. Structured AI Generation

The worker uses **schema-constrained prompting**.

Expected response format:

```json
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Define Newton's First Law.",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ]
}
```

This prevents:

❌ raw markdown dumps  
❌ malformed responses  
❌ inconsistent UI rendering

---

### 7. Database Persistence

Generated assignments are stored in MongoDB.

Stored data includes:

```txt
assignment metadata
question structure
difficulty levels
marks
timestamps
user ownership
status
```

---

### 8. Real-Time Status Updates

The backend emits WebSocket events:

Example lifecycle:

```txt
queued
↓
processing
↓
generating
↓
completed
```

Frontend receives updates instantly.

No refresh required.

---

### 9. Dynamic Rendering

Once generation finishes:

The UI dynamically renders:

### Student Info Section

- Name
- Roll Number
- Section

### Assessment Structure

- sections
- instructions
- questions
- difficulty
- marks

---

# 🧠 AI Processing Architecture

The application intentionally avoids rendering raw LLM responses.

Instead, it follows a deterministic structured generation flow.

---

## Why Structured JSON?

Raw AI output introduces problems:

```txt
Unpredictable formatting
Broken layouts
Inconsistent sections
Parsing failures
```

Instead:

The system forces schema-valid outputs.

Benefits:

✅ deterministic rendering  
✅ stable UI  
✅ easier persistence  
✅ export-safe formatting

---

## Prompt Engineering Strategy

The LLM receives:

### Instructor Context

```txt
Description
Instructions
Question Count
Marks
Difficulty Preferences
Uploaded Context
```

The model returns:

```txt
Structured assessment JSON
```

---

# 📡 Real-Time Communication

The system uses **WebSockets** for live generation feedback.

---

## Event Lifecycle

```txt
Assignment Created
        │
        ▼
Queued
        │
        ▼
Generating Questions
        │
        ▼
Structuring Assessment
        │
        ▼
Completed
```

Benefits:

✅ real-time feedback  
✅ better UX  
✅ no polling overhead  
✅ smoother interactions

---

# 📂 Monorepo Structure

The project follows a **monorepo architecture**.

This keeps:

```txt
frontend
backend
workers
shared logic
```

inside a single repository.

Benefits:

✅ easier deployment  
✅ shared typing  
✅ cleaner architecture  
✅ easier maintenance

---

## Folder Structure

```txt
AI-Assessment-Generator/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── workers/
│   │   ├── queues/
│   │   ├── websocket/
│   │   ├── services/
│   │   └── models/
│   │
│   └── package.json
│
├── README.md
├── .gitignore
└── package.json
```

---

# ⚡ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/ARYANPANWAR893/AI-Assessment-Generator.git
```

```bash
cd AI-Assessment-Generator
```

---

## Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

# 🔐 Environment Variables

Create:

```txt
.env
```

---

## Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Backend Environment Variables

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

REDIS_URL=your_redis_url

GROQ_API_KEY=your_groq_api_key

CLIENT_URL=http://localhost:3000
```

---

# 🧪 Running Locally

### Start Frontend

```bash
cd frontend
npm run dev
```

---

### Start Backend

```bash
cd backend
npm run dev
```

---

### Start Worker

```bash
npm run worker
```

---

## Application URLs

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://localhost:5000
```


# 🚀 Deployment

The application follows a **monorepo deployment strategy**.

The recommended production deployment architecture is:

```txt
Frontend (Next.js)
        │
        ▼
Vercel Hosting
        │
        ▼
API Requests
        │
        ▼
Backend Server (Express)
        │
        ├──────────────► MongoDB Atlas
        │
        ├──────────────► Redis / Upstash
        │
        └──────────────► Groq API
```

---

## Recommended Deployment Stack

### Frontend

**Platform:** Vercel

Why:

✅ seamless Next.js integration  
✅ fast deployments  
✅ automatic CI/CD from GitHub  
✅ environment variable support  
✅ edge optimizations

Deploy command:

```bash
vercel
```

---

### Backend

**Recommended Platforms**

#### Option 1 — Railway

Recommended for:

```txt
Fastest deployment experience
```

Benefits:

✅ Redis support  
✅ simple environment setup  
✅ worker-friendly

---

#### Option 2 — Render

Recommended for:

```txt
Stable free hosting
```

Benefits:

✅ Express deployment support  
✅ persistent API hosting  
✅ background worker compatibility

---

### Database

**MongoDB Atlas**

Benefits:

✅ managed cloud database  
✅ scalable document storage  
✅ free tier support

---

### Redis

**Upstash Redis**

Benefits:

✅ serverless Redis  
✅ BullMQ compatible  
✅ free tier

---

# 🧱 Engineering Tradeoffs

Like most real-world systems, the platform intentionally prioritizes certain engineering decisions based on product goals and implementation constraints.

---

## 1. Queue-Based Generation Over Inline API Calls

### Decision

Instead of:

```txt
HTTP Request
→ Direct LLM Call
→ Response
```

The system uses:

```txt
HTTP Request
→ Queue
→ Worker
→ LLM
→ Database
→ UI Update
```

### Why?

LLM requests are slow and unpredictable.

Direct execution would cause:

❌ API blocking  
❌ timeout failures  
❌ degraded UX

### Tradeoff

Slightly more architecture complexity in exchange for:

✅ scalability  
✅ responsiveness  
✅ production reliability

---

## 2. Lightweight Authentication Over Enterprise Auth

### Decision

Used:

```txt
Custom Session / Context Authentication
```

instead of:

```txt
NextAuth
OAuth
JWT Middleware
Clerk
```

### Why?

The goal was to build a **functional, protected educational workspace** while avoiding unnecessary authentication complexity for an engineering assessment.

### Tradeoff

Current implementation prioritizes:

✅ simplicity  
✅ speed  
✅ dashboard protection

over:

❌ advanced role permissions  
❌ token rotation  
❌ enterprise auth patterns

---

## 3. Structured JSON Generation Over Raw AI Responses

### Decision

The platform intentionally rejects raw LLM text rendering.

Instead:

```txt
LLM
→ JSON Schema
→ Safe Parsing
→ Dynamic UI
```

### Why?

Raw model output introduces instability.

Benefits gained:

✅ deterministic rendering  
✅ consistent formatting  
✅ database compatibility  
✅ export safety

---

## 4. Monorepo Over Multi-Repository Architecture

### Decision

Frontend and backend exist inside one repository.

### Why?

Benefits:

✅ easier onboarding  
✅ shared development context  
✅ simpler deployment  
✅ faster iteration speed

---

## 5. Client-Side Dashboard Interactivity

### Decision

The dashboard emphasizes responsive client-side rendering.

### Why?

Needed to support:

- live websocket updates
- smooth UI state changes
- fast interactions

Tradeoff:

More client-side logic for better UX responsiveness.

---

# ⚠️ Known Limitations

The current implementation intentionally focuses on **core functionality, UX polish, and scalable architecture**.

Below are known limitations and future improvement areas.

---

## 1. Assignment Lifecycle States

### Current State

Assignments are primarily displayed as:

```txt
Completed
Pending
```

### Limitation

The system does not yet fully support:

```txt
queued
processing
retrying
failed
archived
draft
```

### Future Improvement

Introduce a **finite state machine** for assignment tracking.

Example:

```txt
draft
↓
queued
↓
generating
↓
completed
↓
archived
```

---

## 2. Lightweight Authentication Layer

### Current State

Authentication is implemented using a custom Context-based session layer.

### Limitation

Does not yet support:

- JWT validation
- role-based access control
- middleware route protection
- enterprise-grade permissions

### Future Improvement

Move authentication into:

```txt
Next.js middleware.ts
```

with:

```txt
JWT validation
RBAC
session verification
```

---

## 3. AI Failure Handling

### Current State

The platform handles structured parsing gracefully.

### Limitation

Rare malformed AI responses may still require fallback handling.

### Future Improvement

Introduce:

```txt
Zod schema validation
automatic retries
response sanitization
```

---

## 4. Notifications System

### Current State

Notification system currently acts as a lightweight interaction layer.

### Limitation

Does not yet support:

- push notifications
- persistent activity logs
- realtime event history

---

## 5. Large Dataset Scaling

### Current State

Dashboard retrieves assignment collections efficiently for moderate scale.

### Limitation

At very large scale:

```txt
10,000+ assignments
```

pagination and virtualization would become necessary.

### Future Improvement

Introduce:

```txt
cursor pagination
infinite loading
virtualized tables
```

---

# 🛣️ Future Roadmap

The architecture was intentionally designed to support future extensibility.

---

## 🎯 Role-Based Access Management (RBAC)

Support:

### Teacher

Create assessments

### Student

Attempt assessments

### Admin

Manage academic workflows

---

## 📝 Automated Grading Engine

Future capability:

```txt
Upload student responses
        │
        ▼
AI Evaluation
        │
        ▼
Rubric-Based Grading
```

---

## 📊 Analytics Dashboard

Potential insights:

- difficulty distribution
- assignment completion rate
- student performance
- topic-wise analysis
- marks distribution

---

## 🧠 Smarter AI Toolkit

Future educator tools:

- adaptive difficulty balancing
- Bloom’s taxonomy optimization
- question rewriting
- curriculum mapping
- duplicate detection

---

## 👥 Collaborative Classrooms

Support for:

```txt
Departments
Teacher Groups
Classrooms
Student Batches
```

---

## 🔍 Plagiarism Detection

Future architecture support for:

```txt
Question similarity checks
Duplicate content detection
AI-generated similarity scans
```

---

# 💡 Engineering Highlights

This project intentionally focuses on building a **complete product experience**, not simply an AI API wrapper.

Key engineering highlights include:

---

## ⚡ Event-Driven Architecture

Implemented:

```txt
BullMQ + Redis
```

to prevent blocking API calls.

---

## 📡 Real-Time Updates

WebSocket-driven UI synchronization.

No polling required.

---

## 🧠 Structured AI Generation

Deterministic schema-driven outputs.

No raw LLM rendering.

---

## 🧱 Modular Architecture

Clear separation between:

```txt
Frontend
Backend
Workers
Queue
Database
Realtime Layer
```

---

## 🎨 High-Fidelity Frontend

Strong emphasis on:

- spacing
- responsiveness
- layout consistency
- UI hierarchy
- polished UX

to closely replicate provided Figma specifications.

---

## 🔄 Persistent Experience

Generated assignments survive:

✅ refreshes  
✅ route changes  
✅ browser reloads

---

# 🧪 Testing Checklist

Before submission, verify:

### Authentication

- [ ] Login works
- [ ] Signup works
- [ ] Logout works
- [ ] Protected routes work

### Assignment Flow

- [ ] Assignment generation works
- [ ] AI response renders correctly
- [ ] Refresh persistence works
- [ ] Export works
- [ ] Regenerate works

### Realtime

- [ ] WebSocket updates work
- [ ] Loading states update correctly

### UI

- [ ] Responsive on mobile
- [ ] No dead buttons
- [ ] No console errors
- [ ] No broken routes

---

# 🤝 Contributing

This project was developed as part of a Full Stack Engineering assessment.

Future improvements and architectural extensions are intentionally supported through modular design patterns.

---

# 📄 License

This project is intended for educational and evaluation purposes.