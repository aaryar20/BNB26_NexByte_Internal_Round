import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Sparkles,
  Check,
  X,
  Scissors,
  MessageSquareText,
  Zap,
  ArrowRight,
  WandSparkles,
  Clock3,
  Target,
  Lightbulb,
  RotateCcw
} from "lucide-react";

import Layout from "../components/Layout";
import { getSuggestions } from "../services/mockApi";

export default function AISuggestions() {
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState([]);
  const [ignored, setIgnored] = useState([]);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const data = await getSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, []);

  function applySuggestion(id) {
    setIgnored((current) =>
      current.filter((item) => item !== id)
    );

    setApplied((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  }

  function ignoreSuggestion(id) {
    setApplied((current) =>
      current.filter((item) => item !== id)
    );

    setIgnored((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  }

  function resetSuggestion(id) {
    setApplied((current) =>
      current.filter((item) => item !== id)
    );

    setIgnored((current) =>
      current.filter((item) => item !== id)
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="suggestions-loading">

          <div className="suggestions-loading-orb">
            <Sparkles size={20} />
          </div>

          <h2>Finding creative opportunities</h2>

          <p>
            CreatorAI is preparing recommendations for your content.
          </p>

          <div className="suggestions-loading-track">
            <span />
          </div>

        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="suggestions-page">

        {/* HEADER */}

        <section className="suggestions-header">

          <div>
            <div className="suggestions-eyebrow">
              <WandSparkles size={14} />
              CREATOR INTELLIGENCE
            </div>

            <h1>
              Small changes.
              <span> Stronger content.</span>
            </h1>

            <p>
              CreatorAI has studied your content and found ways to
              strengthen your hooks, pacing, captions and clip potential.
            </p>
          </div>


          <button
            onClick={() => navigate("/clips")}
            className="suggestions-clips-button"
          >
            View Generated Clips
            <ArrowRight size={15} />
          </button>

        </section>


        {/* METRICS */}

        <section className="suggestion-metrics">

          <Metric
            icon={Target}
            title="Top Hook Score"
            value="96%"
            detail="Strong opening"
          />

          <Metric
            icon={Scissors}
            title="Clip Candidates"
            value="8"
            detail="Ready to explore"
          />

          <Metric
            icon={Clock3}
            title="Potential Time Saved"
            value="42 min"
            detail="Estimated editing time"
          />

        </section>


        {/* STATUS BAR */}

        <section className="suggestions-status">

          <div>
            <Sparkles size={15} />

            <span>
              {suggestions.length} AI recommendations
            </span>
          </div>

          <div className="suggestions-status-counts">

            <span>
              <strong>{applied.length}</strong>
              Applied
            </span>

            <span>
              <strong>{ignored.length}</strong>
              Ignored
            </span>

            <span>
              <strong>
                {suggestions.length -
                  applied.length -
                  ignored.length}
              </strong>
              To review
            </span>

          </div>

        </section>


        {/* SUGGESTION CARDS */}

        <section className="suggestions-list">

          {suggestions.map((suggestion, index) => {
            const isApplied =
              applied.includes(suggestion.id);

            const isIgnored =
              ignored.includes(suggestion.id);

            return (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                index={index}
                isApplied={isApplied}
                isIgnored={isIgnored}
                onApply={() =>
                  applySuggestion(suggestion.id)
                }
                onIgnore={() =>
                  ignoreSuggestion(suggestion.id)
                }
                onReset={() =>
                  resetSuggestion(suggestion.id)
                }
              />
            );
          })}

        </section>


        {/* BOTTOM CTA */}

        <section className="suggestions-next-step">

          <div>

            <div className="suggestions-next-icon">
              <Scissors size={18} />
            </div>

            <div>
              <span>NEXT STEP</span>

              <h2>
                Your strongest moments are waiting.
              </h2>

              <p>
                Review the clips CreatorAI generated from your
                transcript and recommendations.
              </p>
            </div>

          </div>


          <button onClick={() => navigate("/clips")}>
            Open Clip Gallery
            <ArrowRight size={15} />
          </button>

        </section>

      </div>
    </Layout>
  );
}


function Metric({
  icon: Icon,
  title,
  value,
  detail
}) {
  return (
    <article className="suggestion-metric">

      <div className="suggestion-metric-icon">
        <Icon size={17} />
      </div>

      <div className="suggestion-metric-copy">

        <span>{title}</span>

        <strong>{value}</strong>

        <p>{detail}</p>

      </div>

    </article>
  );
}


function SuggestionCard({
  suggestion,
  index,
  isApplied,
  isIgnored,
  onApply,
  onIgnore,
  onReset
}) {
  return (
    <article
      className={`suggestion-card ${
        isApplied
          ? "suggestion-card-applied"
          : ""
      } ${
        isIgnored
          ? "suggestion-card-ignored"
          : ""
      }`}
      style={{
        animationDelay: `${index * 60}ms`
      }}
    >

      {/* ICON */}

      <SuggestionIcon
        type={suggestion.type}
      />


      {/* CONTENT */}

      <div className="suggestion-content">

        <div className="suggestion-meta">

          <span className="suggestion-type">
            {suggestion.type}
          </span>

          <span className="suggestion-score">
            AI SCORE
            <strong>
              {suggestion.score}%
            </strong>
          </span>

        </div>


        <h2>
          {suggestion.title}
        </h2>


        {suggestion.original && (
          <div className="suggestion-comparison">

            <span>ORIGINAL</span>

            <p>
              “{suggestion.original}”
            </p>

          </div>
        )}


        {(suggestion.start || suggestion.end) && (
          <div className="suggestion-timestamp">
            <Clock3 size={13} />

            <span>
              {suggestion.start}
            </span>

            <ArrowRight size={11} />

            <span>
              {suggestion.end}
            </span>
          </div>
        )}


        <div className="suggestion-recommendation">

          <div className="recommendation-label">
            <Lightbulb size={12} />
            AI RECOMMENDATION
          </div>

          <p>
            {suggestion.suggestion}
          </p>

        </div>


        <div className="suggestion-reason">

          <span>WHY THIS HELPS</span>

          <p>
            {suggestion.reason}
          </p>

        </div>

      </div>


      {/* ACTIONS */}

      <div className="suggestion-actions">

        {isApplied ? (
          <>
            <div className="suggestion-applied-state">
              <Check size={15} />
              Applied
            </div>

            <button
              className="suggestion-reset-button"
              onClick={onReset}
            >
              <RotateCcw size={13} />
              Undo
            </button>
          </>
        ) : isIgnored ? (
          <>
            <div className="suggestion-ignored-state">
              <X size={15} />
              Ignored
            </div>

            <button
              className="suggestion-reset-button"
              onClick={onReset}
            >
              <RotateCcw size={13} />
              Restore
            </button>
          </>
        ) : (
          <>
            <button
              className="suggestion-apply-button"
              onClick={onApply}
            >
              <Check size={14} />
              Apply
            </button>

            <button
              className="suggestion-ignore-button"
              onClick={onIgnore}
            >
              <X size={14} />
              Ignore
            </button>
          </>
        )}

      </div>

    </article>
  );
}


function SuggestionIcon({ type }) {
  let Icon = Sparkles;

  if (type === "Clip") {
    Icon = Scissors;
  }

  if (type === "Caption") {
    Icon = MessageSquareText;
  }

  if (type === "Pacing") {
    Icon = Zap;
  }

  return (
    <div className="suggestion-card-icon">
      <Icon size={19} />
    </div>
  );
}