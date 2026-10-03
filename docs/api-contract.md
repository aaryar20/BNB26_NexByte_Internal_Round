# CreatorAi API Contract

## Health

GET /health

Response:

{
  "status": "healthy"
}

---

## Create Project

POST /projects

Request:

{
  "name": "My First Project"
}

Response:

{
  "id": "project_001",
  "name": "My First Project"
}

---

## Upload Asset

POST /assets

Response:

{
  "id": "asset_001",
  "filename": "video.mp4",
  "type": "video"
}

---

## Analyze Project

POST /projects/{project_id}/analyze

Response:

{
  "project_id": "project_001",
  "status": "completed"
}

---

## Get AI Clips

GET /projects/{project_id}/clips

Response:

{
  "clips": [
    {
      "id": "clip_001",
      "start": 42.2,
      "end": 68.5,
      "score": 0.94,
      "hook": "You're wasting hours creating content.",
      "reason": "Strong problem statement",
      "status": "ai_suggested"
    }
  ]
}

---

## Generate Hooks

POST /clips/{clip_id}/hooks

Response:

{
  "hooks": [
    "You're wasting hours creating content.",
    "What if one video could become ten?",
    "The biggest problem with content creation isn't creativity."
  ]
}

---

## Generate Edit Plan

POST /clips/{clip_id}/edit-plan

Response:

{
  "clip_id": "clip_001",
  "operations": [
    {
      "type": "trim",
      "start": 42.2,
      "end": 68.5
    },
    {
      "type": "caption",
      "style": "dynamic"
    },
    {
      "type": "aspect_ratio",
      "value": "9:16"
    }
  ]
}