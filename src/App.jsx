import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import AssetLibrary from "./pages/AssetLibrary";
import ScriptView from "./pages/ScriptView";
import AISuggestions from "./pages/AISuggestions";
import ClipGallery from "./pages/ClipGallery";
import Editor from "./pages/Editor";
import PlatformPreview from "./pages/PlatformPreview";
import Export from "./pages/Export";

import InteractiveEffects from "./components/InteractiveEffects";
import ClickSound from "./components/ClickSound";

function App() {
  return (
    <BrowserRouter>

      <InteractiveEffects />
      <ClickSound />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/projects"
          element={<Projects />}
        />

        <Route
          path="/new-project"
          element={<NewProject />}
        />

        <Route
          path="/assets"
          element={<AssetLibrary />}
        />

        <Route
          path="/script"
          element={<ScriptView />}
        />

        <Route
          path="/suggestions"
          element={<AISuggestions />}
        />

        <Route
          path="/clips"
          element={<ClipGallery />}
        />

        <Route
          path="/editor"
          element={<Editor />}
        />

        <Route
          path="/preview"
          element={<PlatformPreview />}
        />

        <Route
          path="/export"
          element={<Export />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;