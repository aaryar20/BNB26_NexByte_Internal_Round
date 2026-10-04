import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Clock3,
  Languages,
  Search,
  Sparkles,
  WandSparkles,
  ArrowRight,
  Play,
  Lightbulb,
  Target,
  FileText,
  X,
  Save,
  Brain,
} from "lucide-react";

import Layout from "../components/Layout";

import {
  createScript,
  analyzeProject,
} from "../services/api";

export default function ScriptView() {
  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [scriptText, setScriptText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadScriptFromProject();
  }, []);

  async function loadScriptFromProject() {
    try {
      /*
       * The backend currently does not have a GET script endpoint.
       *
       * So we start with a creator-provided script.
       * The user can edit it below and save it to the backend.
       */

      const savedProject = JSON.parse(
        localStorage.getItem("currentProject") || "null"
      );

      if (!savedProject?.id) {
        setError(
          "No active project found. Please create a project first."
        );
        setLoading(false);
        return;
      }

      /*
       * Starter script for the hackathon demo.
       *
       * The creator can completely replace this text.
       */
      const starterScript = `Today we're going to talk about the biggest problems creators face when making content.

Creators waste hours switching between different tools for scripts, editing, assets and publishing.

You might write your script in one application, store your footage somewhere else and edit everything in another tool.

This constant switching creates repetitive work and makes the entire content process slower.

CreatorAi brings the entire workflow into one intelligent platform.

It understands your script, understands your footage and finds the parts that actually matter.

It can then turn a long video into short clips, generate hooks and adapt the content for different platforms.

The creator still controls every edit because AI suggestions remain editable.

Instead of replacing creators, CreatorAi removes the repetitive work so they can focus on creating.`;

      setScriptText(starterScript);

      /*
       * Build a temporary display transcript from the script.
       * The real backend analysis will use the saved script.
       */
      const segments = starterScript
        .split(/\n\n+/)
        .filter(Boolean)
        .map((text, index) => ({
          id: `script-${index + 1}`,
          start: `${index + 1}`,
          end: `${index + 2}`,
          text,
          type:
            index === 0
              ? "hook"
              : index === 4
              ? "insight"
              : "candidate",
          highlight:
            index === 0 ||
            index === 4 ||
            index === 5 ||
            index === 6,
          score:
            index === 0
              ? 96
              : index === 4
              ? 91
              : index === 5
              ? 88
              : 82,
        }));

      setScript({
        duration: "1:09",
        language: "English",
        segments,
      });
    } catch (error) {
      console.error("Failed to load script:", error);

      setError(
        "Unable to prepare the script workspace."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveScript() {
    const savedProject = JSON.parse(
      localStorage.getItem("currentProject") || "null"
    );

    if (!savedProject?.id) {
      setError(
        "No active project found. Please create a project first."
      );
      return;
    }

    if (!scriptText.trim()) {
      setError("Please enter a script before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await createScript(
        savedProject.id,
        scriptText.trim()
      );

      setSaved(true);
    } catch (error) {
      console.error("Failed to save script:", error);

      setError(
        error.message ||
          "Failed to save the script."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze() {
    const savedProject = JSON.parse(
      localStorage.getItem("currentProject") || "null"
    );

    if (!savedProject?.id) {
      setError(
        "No active project found. Please create a project first."
      );
      return;
    }

    if (!scriptText.trim()) {
      setError("Please enter a script before analyzing.");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      /*
       * Always save the latest version before analysis.
       */
      await createScript(
        savedProject.id,
        scriptText.trim()
      );

      setSaved(true);

      /*
       * Now run the real CreatorAI pipeline.
       */
      await analyzeProject(savedProject.id);

      /*
       * Move to the results/suggestions stage.
       */
      navigate("/suggestions");
    } catch (error) {
      console.error("Analysis failed:", error);

      setError(
        error.message ||
          "Something went wrong while analyzing the project."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="script-loading">

          <div className="script-loading-orb">
            <Sparkles size={19} />
          </div>

          <h2>
            Preparing your transcript
          </h2>

          <p>
            CreatorAI is organizing your content intelligence.
          </p>

          <div className="script-loading-line">
            <span />
          </div>

        </div>
      </Layout>
    );
  }

  if (!script) {
    return (
      <Layout>
        <div className="script-error-state">

          <FileText size={24} />

          <h2>
            Script unavailable
          </h2>

          <p>
            {error ||
              "We couldn't load this project's script."}
          </p>

        </div>
      </Layout>
    );
  }

  const filteredSegments = script.segments.filter(
    (segment) =>
      segment.text
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const highlightedSegments =
    script.segments.filter(
      (segment) => segment.highlight
    );

  return (
    <Layout>
      <div className="script-page">

        {/* HEADER */}

        <section className="script-header">

          <div>

            <div className="script-eyebrow">
              <WandSparkles size={13} />
              AI ANALYSIS
            </div>

            <h1>
              Read between
              <span> the moments.</span>
            </h1>

            <p>
              Explore your script, understand the story and
              prepare the content CreatorAI will analyze for
              high-value clips.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >

            <button
              onClick={handleSaveScript}
              className="script-suggestions-button"
              disabled={saving}
            >
              <Save size={15} />

              {saving
                ? "Saving..."
                : saved
                ? "Saved"
                : "Save Script"}
            </button>

            <button
              onClick={handleAnalyze}
              className="script-suggestions-button"
              disabled={analyzing}
            >
              <Brain size={15} />

              {analyzing
                ? "Analyzing..."
                : "Analyze Script"}

              <ArrowRight size={14} />
            </button>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 18px",
              borderRadius: "12px",
              background: "#f9e9e9",
              color: "#72243a",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* INFORMATION */}

        <section className="script-information">

          <ScriptInfo
            icon={Clock3}
            label="Duration"
            value={script.duration}
          />

          <div className="script-info-divider" />

          <ScriptInfo
            icon={Languages}
            label="Language"
            value={script.language}
          />

          <div className="script-info-divider" />

          <ScriptInfo
            icon={Sparkles}
            label="AI Highlights"
            value={`${highlightedSegments.length} moments`}
            accent
          />

        </section>

        {/* MAIN WORKSPACE */}

        <section className="script-workspace">

          {/* TRANSCRIPT */}

          <div className="transcript-panel">

            <div className="transcript-panel-header">

              <div>
                <span>YOUR SCRIPT</span>

                <h2>
                  Content script
                </h2>
              </div>

              <span className="transcript-segment-count">
                {script.segments.length} sections
              </span>

            </div>

            {/* SCRIPT EDITOR */}

            <div
              style={{
                padding: "20px",
                borderBottom:
                  "1px solid rgba(80, 50, 60, 0.08)",
              }}
            >

              <textarea
                value={scriptText}
                onChange={(event) => {
                  setScriptText(event.target.value);
                  setSaved(false);
                }}
                placeholder="Paste or write your script here..."
                rows={12}
                style={{
                  width: "100%",
                  resize: "vertical",
                  border: "1px solid rgba(80, 50, 60, 0.12)",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "rgba(255,255,255,0.55)",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />

            </div>

            {/* SEARCH */}

            <div className="transcript-search">

              <Search size={15} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search the transcript..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}

            </div>

            {/* SEGMENTS */}

            <div className="transcript-segments">

              {filteredSegments.length > 0 ? (

                filteredSegments.map(
                  (segment, index) => (

                    <TranscriptSegment
                      key={segment.id}
                      segment={segment}
                      index={index}
                      selected={
                        selectedSegment ===
                        segment.id
                      }
                      onSelect={() =>
                        setSelectedSegment(
                          selectedSegment ===
                            segment.id
                            ? null
                            : segment.id
                        )
                      }
                    />

                  )
                )

              ) : (

                <div className="transcript-no-results">

                  <Search size={19} />

                  <h3>
                    No matching dialogue
                  </h3>

                  <p>
                    Try searching for another word or phrase.
                  </p>

                  <button
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>

                </div>

              )}

            </div>

          </div>

          {/* RIGHT SIDE */}

          <aside className="script-intelligence">

            {/* SUMMARY */}

            <div className="script-summary-card">

              <div className="summary-card-heading">

                <div className="summary-icon">
                  <Sparkles size={17} />
                </div>

                <div>
                  <span>AI SUMMARY</span>
                  <h2>
                    Content overview
                  </h2>
                </div>

              </div>

              <p className="summary-description">
                This script explains how CreatorAI can reduce
                editing time by understanding creator intent,
                matching scripts to footage and identifying
                high-value moments.
              </p>

              <div className="summary-detail">

                <div className="summary-detail-icon">
                  <Lightbulb size={14} />
                </div>

                <div>
                  <span>MAIN TOPIC</span>

                  <strong>
                    AI-powered content creation
                  </strong>
                </div>

              </div>

              <div className="summary-detail">

                <div className="summary-detail-icon">
                  <Target size={14} />
                </div>

                <div>
                  <span>AUDIENCE</span>

                  <strong>
                    Creators & marketers
                  </strong>
                </div>

              </div>

            </div>

            {/* INTELLIGENCE CARD */}

            <div className="script-insight-card">

              <div className="insight-glow" />

              <div className="insight-label">
                <WandSparkles size={12} />
                CREATOR INTELLIGENCE
              </div>

              <h3>
                Strong opening detected.
              </h3>

              <p>
                The opening contains a clear pain-point hook
                and could work especially well as a
                short-form opening.
              </p>

              <div className="insight-score">

                <div>
                  <span>HOOK STRENGTH</span>
                  <strong>96%</strong>
                </div>

                <div className="insight-score-track">
                  <span />
                </div>

              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                {analyzing
                  ? "Analyzing..."
                  : "Analyze & create clips"}

                <ArrowRight size={13} />
              </button>

            </div>

          </aside>

        </section>

      </div>
    </Layout>
  );
}


/* -------------------------------- */
/* SCRIPT INFO                      */
/* -------------------------------- */

function ScriptInfo({
  icon: Icon,
  label,
  value,
  accent,
}) {
  return (
    <div
      className={`script-info-item ${
        accent ? "script-info-accent" : ""
      }`}
    >

      <div className="script-info-icon">
        <Icon size={15} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}


/* -------------------------------- */
/* TRANSCRIPT SEGMENT               */
/* -------------------------------- */

function TranscriptSegment({
  segment,
  index,
  selected,
  onSelect,
}) {
  const label =
    segment.type === "hook"
      ? "Strong Hook"
      : segment.type === "insight"
      ? "Key Insight"
      : "Clip Candidate";

  return (
    <article
      className={`transcript-segment ${
        segment.highlight
          ? "transcript-highlight"
          : ""
      } ${
        selected
          ? "transcript-segment-selected"
          : ""
      }`}
      style={{
        animationDelay: `${index * 35}ms`,
      }}
      onClick={onSelect}
    >

      <div className="segment-time">

        <button
          aria-label={`Play from ${segment.start}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Play
            size={10}
            fill="currentColor"
          />
        </button>

        <span>
          {segment.start}
        </span>

      </div>

      <div className="segment-content">

        <p>
          {segment.text}
        </p>

        {segment.highlight && (
          <div className="segment-intelligence">

            <span className="segment-type">
              <Sparkles size={10} />
              {label}
            </span>

            <div className="segment-score">

              <span>
                AI SCORE
              </span>

              <strong>
                {segment.score}%
              </strong>

            </div>

          </div>
        )}

      </div>

    </article>
  );
}