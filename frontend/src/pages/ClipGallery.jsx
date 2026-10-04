import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Play,
  Scissors,
  Sparkles,
  Clock3,
  Smartphone,
  ArrowRight,
  WandSparkles,
  Trophy,
  LayoutGrid,
  Check,
  Eye,
} from "lucide-react";

import Layout from "../components/Layout";
import { getProjectAnalysis } from "../services/api";

export default function ClipGallery() {
  const navigate = useNavigate();

  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClips() {
      try {
        setLoading(true);
        setError("");

        const savedProject = JSON.parse(
          localStorage.getItem("currentProject") || "null"
        );

        if (!savedProject?.id) {
          throw new Error(
            "No active project found. Please create a project first."
          );
        }

        const data = await getProjectAnalysis(savedProject.id);

        const backendClips = Array.isArray(data?.clips)
          ? data.clips
          : [];

        const formattedClips = backendClips.map((clip, index) => {
          const start = Number(clip.start) || 0;
          const end = Number(clip.end) || start;

          const duration = Math.max(0, end - start);

          const score = Math.round(
            (Number(clip.score) || 0) * 100
          );

          const beatType = String(
            clip.beat_type || ""
          ).toLowerCase();

          let category = "Clip Candidate";

          if (beatType === "hook") {
            category = "Strong Hook";
          } else if (beatType === "solution") {
            category = "Solution";
          } else if (beatType === "benefit") {
            category = "Benefit";
          } else if (beatType === "insight") {
            category = "Key Insight";
          }

          return {
            id: clip.clip_id || `clip_${index + 1}`,

            title:
              clip.hook ||
              clip.source_text ||
              `${category} moment`,

            category,

            score: Math.max(
              0,
              Math.min(100, score)
            ),

            start,
            end,

            duration:
              Math.round(duration * 10) / 10,

            format: "9:16",

            reason:
              clip.reason ||
              "AI identified this segment as having strong short-form potential.",

            sourceText:
              clip.source_text || "",

            hooks: Array.isArray(clip.hooks)
              ? clip.hooks
              : [],

            editPlan:
              clip.edit_plan || null,

            platformAdaptations:
              clip.platform_adaptations || null,

            raw: clip,
          };
        });

        setClips(formattedClips);
      } catch (error) {
        console.error(
          "Failed to load clips:",
          error
        );

        setError(
          error?.message ||
            "Failed to load AI-generated clips."
        );
      } finally {
        setLoading(false);
      }
    }

    loadClips();
  }, []);

  function editClip(clip) {
    localStorage.setItem(
      "selectedClip",
      JSON.stringify(clip)
    );

    navigate("/editor");
  }

  if (loading) {
    return (
      <Layout>
        <div className="clips-loading">
          <div className="clips-loading-orb">
            <Scissors size={20} />
          </div>

          <h2>
            Finding your best moments
          </h2>

          <p>
            CreatorAI is loading the
            AI-generated clips from your
            project.
          </p>

          <div className="clips-loading-track">
            <span />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="clips-loading">
          <div className="clips-loading-orb">
            <Scissors size={20} />
          </div>

          <h2>
            Couldn't load your clips
          </h2>

          <p>{error}</p>

          <button
            className="clip-edit-button"
            onClick={() => navigate("/assets")}
            style={{
              marginTop: "20px",
            }}
          >
            Back to Assets
            <ArrowRight size={13} />
          </button>
        </div>
      </Layout>
    );
  }

  const bestScore =
    clips.length > 0
      ? Math.max(
          ...clips.map(
            (clip) => clip.score
          )
        )
      : 0;

  return (
    <Layout>
      <div className="clips-page">

        {/* HEADER */}

        <section className="clips-header">
          <div>
            <div className="clips-eyebrow">
              <WandSparkles size={14} />
              AI GENERATED
            </div>

            <h1>
              Your content,
              <span> reimagined.</span>
            </h1>

            <p>
              CreatorAI found the moments
              with the strongest short-form
              potential. Preview the ideas,
              compare their scores and choose
              one to refine.
            </p>
          </div>

          <div className="clips-header-badge">
            <Sparkles size={15} />

            <div>
              <span>AI PROCESSING</span>
              <strong>Complete</strong>
            </div>

            <Check size={15} />
          </div>
        </section>

        {/* SUMMARY */}

        <section className="clips-summary">

          <Summary
            icon={Scissors}
            title="Clips Generated"
            value={clips.length}
            detail="AI-selected moments"
          />

          <Summary
            icon={Trophy}
            title="Best AI Score"
            value={`${bestScore}%`}
            detail="Highest potential"
          />

          <Summary
            icon={Smartphone}
            title="Optimized Format"
            value="9:16"
            detail="Vertical short-form"
          />

        </section>

        {/* SECTION HEADER */}

        <section className="clips-section-heading">
          <div>
            <LayoutGrid size={15} />

            <div>
              <span>CLIP GALLERY</span>

              <h2>
                AI-selected moments
              </h2>
            </div>
          </div>

          <span className="clips-result-count">
            {clips.length} results
          </span>
        </section>

        {/* CLIP GRID */}

        {clips.length > 0 ? (
          <section className="clips-grid">
            {clips.map((clip, index) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                index={index}
                selected={
                  selectedPreview ===
                  clip.id
                }
                onPreview={() =>
                  setSelectedPreview(
                    selectedPreview ===
                      clip.id
                      ? null
                      : clip.id
                  )
                }
                onEdit={() =>
                  editClip(clip)
                }
              />
            ))}
          </section>
        ) : (
          <div className="clips-loading">
            <div className="clips-loading-orb">
              <Scissors size={20} />
            </div>

            <h2>
              No clips found
            </h2>

            <p>
              Run AI analysis on your
              project first.
            </p>

            <button
              className="clip-edit-button"
              onClick={() =>
                navigate("/assets")
              }
              style={{
                marginTop: "20px",
              }}
            >
              Go to Asset Library
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}


/* -------------------------------- */
/* CLIP CARD                        */
/* -------------------------------- */

function ClipCard({
  clip,
  index,
  selected,
  onPreview,
  onEdit,
}) {
  return (
    <article
      className={`clip-card ${
        selected
          ? "clip-card-selected"
          : ""
      }`}
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >

      {/* VIDEO PREVIEW */}

      <div className="clip-preview">

        <div className="clip-preview-glow clip-glow-one" />

        <div className="clip-preview-glow clip-glow-two" />

        <div className="clip-rank">
          <Sparkles size={10} />
          #{index + 1} AI Pick
        </div>

        <div className="clip-preview-format">
          9:16
        </div>

        <button
          className="clip-play-button"
          onClick={onPreview}
          aria-label="Preview clip"
        >
          {selected ? (
            <Eye size={19} />
          ) : (
            <Play
              size={19}
              fill="currentColor"
            />
          )}
        </button>

        {selected && (
          <div className="clip-preview-message">
            <Sparkles size={13} />

            <div>
              <strong>
                Preview selected
              </strong>

              <span>
                Video playback connects
                here later
              </span>
            </div>
          </div>
        )}

        <div className="clip-preview-bottom">

          <span>
            <Clock3 size={11} />

            {formatTime(clip.start)}

            {" → "}

            {formatTime(clip.end)}
          </span>

          <span>
            {clip.duration}s
          </span>

        </div>
      </div>


      {/* CONTENT */}

      <div className="clip-content">

        <div className="clip-content-top">

          <div>

            <span className="clip-category">
              {clip.category}
            </span>

            <h2>
              {clip.title}
            </h2>

          </div>

          <div className="clip-ai-score">

            <span>AI</span>

            <strong>
              {clip.score}%
            </strong>

          </div>

        </div>


        <p className="clip-reason">
          {clip.reason}
        </p>


        {/* SCORE BAR */}

        <div className="clip-score-section">

          <div>

            <span>
              CLIP POTENTIAL
            </span>

            <strong>
              {getScoreLabel(
                clip.score
              )}
            </strong>

          </div>

          <div className="clip-score-track">

            <span
              style={{
                width: `${clip.score}%`,
              }}
            />

          </div>

        </div>


        {/* META */}

        <div className="clip-meta">

          <span>
            <Clock3 size={13} />
            {clip.duration}s
          </span>

          <span>
            <Smartphone size={13} />
            {clip.format}
          </span>

          <span>
            <Sparkles size={13} />
            AI Pick
          </span>

        </div>


        {/* ACTIONS */}

        <div className="clip-actions">

          <button
            className="clip-preview-button"
            onClick={onPreview}
          >
            <Play size={14} />
            Preview
          </button>

          <button
            className="clip-edit-button"
            onClick={onEdit}
          >
            <Scissors size={14} />
            Edit Clip
            <ArrowRight size={13} />
          </button>

        </div>

      </div>

    </article>
  );
}


/* -------------------------------- */
/* SUMMARY                          */
/* -------------------------------- */

function Summary({
  icon: Icon,
  title,
  value,
  detail,
}) {
  return (
    <article className="clip-summary-card">

      <div className="clip-summary-icon">
        <Icon size={17} />
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <p>
          {detail}
        </p>

      </div>

    </article>
  );
}


/* -------------------------------- */
/* SCORE LABEL                      */
/* -------------------------------- */

function getScoreLabel(score) {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 80) {
    return "Strong";
  }

  if (score >= 70) {
    return "Good";
  }

  return "Potential";
}


/* -------------------------------- */
/* TIME FORMAT                      */
/* -------------------------------- */

function formatTime(seconds) {
  const totalSeconds = Math.round(
    Number(seconds) || 0
  );

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const remainingSeconds =
    totalSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}