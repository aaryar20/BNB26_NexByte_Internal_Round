import projects from "../mock/projects.json";
import script from "../mock/script.json";
import suggestions from "../mock/suggestions.json";
import clips from "../mock/clips.json";

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getProjects() {
  await delay(500);

  return projects;
}
export async function getScript() {
  await delay(600);

  return script;
}
export async function getSuggestions() {
  await delay(600);

  return suggestions;
}
export async function getClips() {
  await delay(600);

  return clips;
}