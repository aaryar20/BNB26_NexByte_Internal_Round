```markdown
# ⚡ CreatorAi

### AI-Powered Creator Operating Platform

> **From creator intent to editable content — automatically.**

CreatorAi is an AI-powered content operations platform designed to reduce the repetitive work involved in creating, editing, and adapting digital content.

Instead of simply generating a final video, CreatorAi understands **what the creator is trying to communicate**, finds the relevant moments in their footage, and produces an **editable AI-suggested edit plan**.

---

## 🚀 Why CreatorAi?

Content creation is fragmented across multiple tools.

Creators often have to:

- 📝 Write scripts in one place
- 🎥 Store footage somewhere else
- ✂️ Edit videos manually
- 💡 Think of hooks
- 📱 Adapt content for different platforms
- 📊 Analyze performance separately

This creates repetitive work and constant context switching.

### CreatorAi brings these steps together.

```text
        SCRIPT + FOOTAGE
               │
               ▼
       🧠 CONTENT UNDERSTANDING
               │
               ▼
      🔗 SCRIPT → FOOTAGE MATCHING
               │
               ▼
          ⭐ CLIP RANKING
               │
        ┌──────┼──────┐
        ▼      ▼      ▼
      HOOKS  EDITS  ADAPTATION
        │      │      │
        └──────┼──────┘
               ▼
       ✨ CREATOR INTELLIGENCE
               │
               ▼
        EDITABLE EDIT PLAN
               │
               ▼
          🎬 FINAL VIDEO
```

---

# 💡 The X-Factor

## Intent-Aware Editing

Most automated video tools focus on producing a final video.

CreatorAi focuses on understanding **creator intent**.

The system connects:

```text
What the creator wants to say
              ↓
What actually appears in the footage
              ↓
Which footage matters most
              ↓
How that footage should be edited
```

The AI does not take control away from the creator.

Instead, it provides **editable suggestions** that the creator can accept, reject, or modify.

> **AI suggests. The creator decides.**

---

# ✨ Core Features

### 🧠 Script Beat Analysis

The script is divided into meaningful content beats such as:

- Hook
- Problem
- Solution
- Insight
- Benefit
- CTA

---

### 🔗 Semantic Script-to-Footage Matching

CreatorAi uses semantic similarity to connect script content with the most relevant parts of the video transcript.

This allows the system to find footage based on **meaning**, not just exact keywords.

---

### ⭐ Intelligent Clip Ranking

Matched clips are ranked using multiple factors:

- Semantic similarity
- Beat importance
- Hook strength
- Context
- Duration

This produces a prioritized list of potential clips.

---

### 🎯 AI Hook Generation

Multiple hook variations can be generated for each selected clip.

Current hook styles include:

- Direct
- Problem
- Curiosity
- Educational
- Contrarian

---

### ✂️ Editable AI Edit Plans

Instead of immediately rendering a video, CreatorAi generates an edit plan.

Example:

```text
Clip
 ├── ✂️ Trim
 ├── 💬 Dynamic Captions
 └── 📱 9:16 Aspect Ratio
```

Each operation is marked as an AI suggestion.

---

### 📱 Platform Adaptation

Content can be adapted for different platforms.

Currently supported:

| Platform | Format |
|----------|--------|
| Instagram | 9:16 |
| YouTube Shorts | 9:16 |
| LinkedIn | 1:1 |

The system can generate platform-specific:

- Captions
- Titles
- Descriptions
- Hashtags
- Tone
- Aspect ratios

---

### 📊 Creator Intelligence

CreatorAi includes a creator intelligence layer that analyzes performance data and generates insights such as:

- Views
- Engagement
- Retention
- Watch time
- Content patterns
- Recommendations

The current implementation uses demo performance data and is structured so real platform analytics can be integrated later.

---

# 🏗️ Architecture

```text
┌─────────────────────────────────────────────┐
│                  CreatorAi                  │
├─────────────────────────────────────────────┤
│                                             │
│   Script ──────────────┐                   │
│                        ▼                   │
│                ┌──────────────┐            │
│                │ Beat Analyzer│            │
│                └──────┬───────┘            │
│                       │                    │
│                       ▼                    │
│                ┌──────────────┐            │
│ Video ────────►│  Alignment   │            │
│ Transcript     │    Engine    │            │
│                └──────┬───────┘            │
│                       │                    │
│                       ▼                    │
│                ┌──────────────┐            │
│                │ Clip Ranker  │            │
│                └──────┬───────┘            │
│                       │                    │
│          ┌────────────┼────────────┐       │
│          ▼            ▼            ▼       │
│       Hooks       Edit Plan   Platform     │
│                               Adaptation   │
│          └────────────┼────────────┘       │
│                       ▼                    │
│              Creator Intelligence          │
│                       │                    │
│                       ▼                    │
│                 SQLite DB                  │
│                       │                    │
│                       ▼                    │
│                FFmpeg Engine               │
│                       │                    │
│                       ▼                    │
│                 Final Video                │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 🛠️ Tech Stack

### Backend

- **Python**
- **FastAPI**
- **SQLAlchemy**
- **SQLite**

### AI / NLP

- **Sentence Transformers**
- **Semantic Similarity**
- **Rule-based Content Beat Analysis**
- **AI-assisted Clip Ranking**
- **Hook Generation**

### Video Processing

- **FFmpeg**

### Frontend

- **Next.js**
- **React**
- **Tailwind CSS**

---

# 📂 Project Structure

```text
creator-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── uploads/
│   └── creator_ai.db
│
├── frontend/
│
├── video-engine/
│
├── docs/
│
├── README.md
└── .gitignore
```

---

# 🔌 API

## Health Check

```http
GET /health
```

---

## Create Project

```http
POST /projects
```

---

## Upload Asset

```http
POST /projects/{project_id}/assets
```

---

## Add Script

```http
POST /projects/{project_id}/scripts
```

---

## Run AI Analysis

```http
POST /projects/{project_id}/analyze
```

This runs the complete AI pipeline:

```text
Script
 ↓
Beat Analysis
 ↓
Semantic Matching
 ↓
Clip Ranking
 ↓
Hook Generation
 ↓
Edit Planning
 ↓
Platform Adaptation
 ↓
Creator Intelligence
 ↓
Database Persistence
```

---

## Retrieve Saved Analysis

```http
GET /projects/{project_id}/analysis
```

Returns persisted clips and their associated edit operations.

---

# 🧪 Current AI Pipeline

For each project:

### 1. Script → Beats

```text
Script
 ↓
HOOK
PROBLEM
SOLUTION
BENEFIT
INSIGHT
```

### 2. Beats → Footage

The alignment engine compares each beat with transcript segments using semantic embeddings.

### 3. Footage → Ranked Clips

Each candidate is scored using:

```text
Semantic Score
        +
Beat Importance
        +
Hook Strength
        +
Context
        +
Duration
```

### 4. Ranked Clips → Edit Suggestions

The system creates:

```text
Trim
Captions
Aspect Ratio
```

### 5. Edit Suggestions → Platform Adaptations

Content is adapted for:

```text
Instagram
YouTube Shorts
LinkedIn
```

---

# 🗄️ Data Persistence

CreatorAi stores generated editing information in SQLite.

The database structure follows:

```text
Project
 ├── Assets
 ├── Scripts
 │    └── Script Beats
 │
 └── Clips
      └── Edits
```

This allows generated AI suggestions to remain available after the analysis request finishes.

---

# ▶️ Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/aaryar20/BNB26_NexByte_Internal_Round.git
cd BNB26_NexByte_Internal_Round
```

---

## 2. Enter the backend

```bash
cd backend
```

---

## 3. Create virtual environment

```bash
python3.12 -m venv venv312
```

Activate it:

### macOS / Linux

```bash
source venv312/bin/activate
```

### Windows

```bash
venv312\Scripts\activate
```

---

## 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Start the backend

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔄 Current Development Flow

```text
        Creator
           │
           ▼
      Upload Video
           │
           ▼
       Add Script
           │
           ▼
     Run AI Analysis
           │
           ▼
    ┌───────────────┐
    │ CreatorAi AI  │
    └───────┬───────┘
            │
            ▼
      Ranked Clips
            │
            ▼
     Editable Edits
            │
            ▼
      Creator Review
            │
            ▼
       FFmpeg Render
            │
            ▼
       Final Content
```

---

# 🚧 Development Status

### Completed

- [x] FastAPI backend
- [x] Project management
- [x] Video asset upload
- [x] Script management
- [x] Content beat analysis
- [x] Semantic script-to-footage matching
- [x] Clip ranking
- [x] Hook generation
- [x] Editable edit plans
- [x] Platform adaptation
- [x] Creator intelligence
- [x] SQLite persistence
- [x] Analysis API
- [x] Duplicate analysis protection

### In Progress

- [ ] Frontend integration
- [ ] Interactive edit controls
- [ ] FFmpeg rendering pipeline
- [ ] End-to-end content generation

### Future

- [ ] Real transcription with Whisper
- [ ] Real social platform analytics
- [ ] More platform integrations
- [ ] Advanced creator personalization
- [ ] Cloud deployment

---

# 👥 Team

### Team NexByte

**CreatorAi — AI-Powered Creator Operating Platform**

Built for the hackathon with a focus on:

> **AI × Content Creation × Intelligent Editing**

---

# 📜 Vision

CreatorAi is designed around one simple idea:

> **Creators should spend their time creating — not moving content between tools.**

The goal is not to replace the creator.

The goal is to remove the repetitive work around them.

---

<p align="center">

### ⚡ CreatorAi
**Understand the intent. Find the moment. Build the edit.**

</p>
```

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.