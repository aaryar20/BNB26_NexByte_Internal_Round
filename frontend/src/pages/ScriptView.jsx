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
  X
} from "lucide-react";

import Layout from "../components/Layout";
import { getScript } from "../services/mockApi";

export default function ScriptView() {
  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    async function loadScript() {
      try {
        const data = await getScript();
        setScript(data);
      } catch (error) {
        console.error("Failed to load transcript:", error);
      } finally {
        setLoading(false);
      }
    }

    loadScript();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="script-loading">

          <div className="script-loading-orb">
            <Sparkles size={19} />
          </div>

          <h2>Preparing your transcript</h2>

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

          <h2>Transcript unavailable</h2>

          <p>
            We couldn't load this project's transcript.
          </p>
        </div>
      </Layout>
    );
  }

  const filteredSegments = script.segments.filter((segment) =>
    segment.text
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const highlightedSegments = script.segments.filter(
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
              Explore your transcript, understand the story and
              discover the moments CreatorAI believes are worth
              turning into clips.
            </p>
          </div>


          <button
            onClick={() => navigate("/suggestions")}
            className="script-suggestions-button"
          >
            <Sparkles size={15} />
            AI Suggestions
            <ArrowRight size={14} />
          </button>

        </section>


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
                <span>TRANSCRIPT</span>

                <h2>
                  Your conversation
                </h2>
              </div>

              <span className="transcript-segment-count">
                {script.segments.length} segments
              </span>

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

                filteredSegments.map((segment, index) => (
                  <TranscriptSegment
                    key={segment.id}
                    segment={segment}
                    index={index}
                    selected={
                      selectedSegment === segment.id
                    }
                    onSelect={() =>
                      setSelectedSegment(
                        selectedSegment === segment.id
                          ? null
                          : segment.id
                      )
                    }
                  />
                ))

              ) : (

                <div className="transcript-no-results">

                  <Search size={19} />

                  <h3>No matching dialogue</h3>

                  <p>
                    Try searching for another word or phrase.
                  </p>

                  <button onClick={() => setSearch("")}>
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
                  <h2>Content overview</h2>
                </div>

              </div>


              <p className="summary-description">
                This video explains how creators can use
                artificial intelligence to reduce editing time
                and automatically identify high-value moments.
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
                The first 8 seconds contain a clear pain-point
                hook and could work especially well as a
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
                onClick={() => navigate("/suggestions")}
              >
                See recommendation
                <ArrowRight size={13} />
              </button>

            </div>

          </aside>

        </section>

      </div>
    </Layout>
  );
}


function ScriptInfo({
  icon: Icon,
  label,
  value,
  accent
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


function TranscriptSegment({
  segment,
  index,
  selected,
  onSelect
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
        animationDelay: `${index * 35}ms`
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