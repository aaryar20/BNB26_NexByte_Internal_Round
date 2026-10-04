const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();

      message =
        data.detail ||
        data.message ||
        data.error ||
        message;
    } catch {
      // Use default message
    }

    throw new Error(message);
  }

  return response.json();
}


// CREATE PROJECT

export async function createProject(name, description = "") {
  const response = await fetch(
    `${API_BASE_URL}/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    }
  );

  return handleResponse(response);
}

// GET ALL PROJECTS

export async function getProjects() {
  const response = await fetch(
    `${API_BASE_URL}/projects`
  );

  return handleResponse(response);
}



// GET PROJECT

export async function getProject(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}`
  );

  return handleResponse(response);
}


// UPLOAD VIDEO / IMAGE / AUDIO

export async function uploadAsset(projectId, file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/assets`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
}


// CREATE / UPLOAD SCRIPT

export async function createScript(projectId, content) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/scripts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  return handleResponse(response);
}


// RUN COMPLETE AI PIPELINE

export async function analyzeProject(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/analyze`,
    {
      method: "POST",
    }
  );

  return handleResponse(response);
}


// GET PERSISTED AI ANALYSIS

export async function getProjectAnalysis(projectId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/analysis`
  );

  return handleResponse(response);
}





export async function renderClip(projectId, clipId, format = "9:16") {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/render`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clip_id: clipId,
        format,
      }),
    }
  );

  return handleResponse(response);
}