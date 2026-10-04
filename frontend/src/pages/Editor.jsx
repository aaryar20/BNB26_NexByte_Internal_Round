import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Play,
  Pause,
  Scissors,
  Captions,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  Monitor,
  Sparkles,
  ArrowRight,
  Video,
  RotateCcw,
  Music,
  SlidersHorizontal,
  WandSparkles,
  Clock3,
  Check,
  Layers3
} from "lucide-react";

import Layout from "../components/Layout";

export default function Editor() {
  const navigate = useNavigate();

  const savedClip = JSON.parse(
    localStorage.getItem("selectedClip")
  );

  const savedProject = JSON.parse(
    localStorage.getItem("currentProject")
  );

  const clip = savedClip || {
    id: "clip001",
    title: "The Content Creation Problem",
    start: 0,
    end: 23,
    duration: 23,
    score: 96
  };

  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  const [captionText, setCaptionText] = useState(
    "You're wasting hours editing content manually."
  );

  const [volume, setVolume] = useState(100);
  const [playing, setPlaying] = useState(false);

  const [activeTool, setActiveTool] = useState("captions");

  function createRenderRequest() {
    const operations = [
      {
        type: "trim",
        start: clip.start,
        end: clip.end
      }
    ];

    if (captionsEnabled && captionText.trim()) {
      operations.push({
        type: "caption",
        text: captionText
      });
    }

    operations.push({
      type: "audio",
      volume: volume
    });

    const request = {
      source:
        savedProject?.videoName || "video.mp4",
      operations,
      format: aspectRatio
    };

    localStorage.setItem(
      "renderRequest",
      JSON.stringify(request)
    );

    navigate("/preview");
  }

  return (
    <Layout>
      <div className="editor-page">

        {/* HEADER */}

        <section className="editor-header">

          <div>
            <div className="editor-eyebrow">
              <WandSparkles size={13} />
              CREATOR EDITOR
            </div>

            <h1>{clip.title}</h1>

            <div className="editor-header-meta">
              <span>
                <Sparkles size={12} />
                AI Score {clip.score}%
              </span>

              <span>
                <Clock3 size={12} />
                {clip.duration} second clip
              </span>

              <span>
                <Smartphone size={12} />
                {aspectRatio}
              </span>
            </div>
          </div>


          <div className="editor-header-actions">

            <button
              className="editor-back-button"
              onClick={() => navigate("/clips")}
            >
              <RotateCcw size={15} />
              Back to Clips
            </button>

            <button
              className="editor-preview-button"
              onClick={createRenderRequest}
            >
              Preview
              <ArrowRight size={14} />
            </button>

          </div>

        </section>


        {/* MAIN EDITOR */}

        <section className="editor-workspace">

          {/* LEFT ASSET PANEL */}

          <aside className="editor-assets-panel">

            <div className="editor-panel-title">
              <Layers3 size={14} />
              <span>MEDIA</span>
            </div>


            <div className="editor-asset-section">

              <span className="editor-small-label">
                SOURCE
              </span>

              <div className="editor-source-card">

                <div className="editor-source-preview">
                  <Video size={22} />

                  <span>Source</span>
                </div>

                <div className="editor-source-info">
                  <strong title={savedProject?.videoName}>
                    {savedProject?.videoName ||
                      "source-video.mp4"}
                  </strong>

                  <span>Original video</span>
                </div>

              </div>

            </div>


            <div className="editor-asset-section">

              <span className="editor-small-label">
                SELECTED CLIP
              </span>

              <div className="editor-selected-clip">

                <div className="editor-selected-icon">
                  <Scissors size={15} />
                </div>

                <div>
                  <strong>
                    {formatTime(clip.start)} →{" "}
                    {formatTime(clip.end)}
                  </strong>

                  <span>
                    {clip.duration} seconds
                  </span>
                </div>

                <Check size={14} />

              </div>

            </div>


            <div className="editor-asset-section">

              <span className="editor-small-label">
                QUICK TOOLS
              </span>

              <div className="editor-quick-tools">

                <QuickTool
                  icon={Captions}
                  label="Captions"
                  active={activeTool === "captions"}
                  onClick={() =>
                    setActiveTool("captions")
                  }
                />

                <QuickTool
                  icon={Volume2}
                  label="Audio"
                  active={activeTool === "audio"}
                  onClick={() =>
                    setActiveTool("audio")
                  }
                />

                <QuickTool
                  icon={Smartphone}
                  label="Format"
                  active={activeTool === "format"}
                  onClick={() =>
                    setActiveTool("format")
                  }
                />

              </div>

            </div>

          </aside>


          {/* CENTER PREVIEW */}

          <main className="editor-preview-area">

            <div className="editor-preview-heading">

              <div>
                <span>CANVAS</span>
                <strong>Preview</strong>
              </div>

              <div className="editor-preview-status">
                <span />
                Live preview
              </div>

            </div>


            <div className="editor-canvas">

              <div
                className={`editor-video-frame ${
                  aspectRatio === "9:16"
                    ? "editor-ratio-vertical"
                    : aspectRatio === "1:1"
                    ? "editor-ratio-square"
                    : "editor-ratio-wide"
                }`}
              >

                <div className="editor-video-pattern" />


                <div className="editor-frame-top">

                  <span>
                    {aspectRatio}
                  </span>

                  <span>
                    {clip.duration}s
                  </span>

                </div>


                <button
                  className="editor-main-play"
                  onClick={() =>
                    setPlaying(!playing)
                  }
                >
                  {playing ? (
                    <Pause
                      size={22}
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      size={22}
                      fill="currentColor"
                    />
                  )}
                </button>


                {captionsEnabled &&
                  captionText.trim() && (
                    <div className="editor-caption-preview">
                      <span>
                        {captionText}
                      </span>
                    </div>
                  )}


                <div className="editor-frame-gradient" />

              </div>

            </div>


            {/* PLAYBACK */}

            <div className="editor-playback">

              <button
                onClick={() =>
                  setPlaying(!playing)
                }
              >
                {playing ? (
                  <Pause
                    size={17}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={17}
                    fill="currentColor"
                  />
                )}
              </button>

              <span>
                {formatTime(clip.start)}
              </span>

              <div className="editor-playback-track">
                <div className="editor-playback-progress">

                  <span className="editor-playhead" />

                </div>
              </div>

              <span>
                {formatTime(clip.end)}
              </span>

            </div>

          </main>


          {/* RIGHT PROPERTIES */}

          <aside className="editor-properties">

            <div className="editor-panel-title">
              <SlidersHorizontal size={14} />
              <span>PROPERTIES</span>
            </div>


            {/* FORMAT */}

            <PropertySection
              title="Aspect Ratio"
              description="Choose your publishing format."
            >

              <div className="editor-ratio-options">

                <RatioButton
                  icon={Smartphone}
                  label="9:16"
                  active={aspectRatio === "9:16"}
                  onClick={() =>
                    setAspectRatio("9:16")
                  }
                />

                <RatioButton
                  icon={Square}
                  label="1:1"
                  active={aspectRatio === "1:1"}
                  onClick={() =>
                    setAspectRatio("1:1")
                  }
                />

                <RatioButton
                  icon={Monitor}
                  label="16:9"
                  active={aspectRatio === "16:9"}
                  onClick={() =>
                    setAspectRatio("16:9")
                  }
                />

              </div>

            </PropertySection>


            {/* CAPTIONS */}

            <PropertySection
              title="Captions"
              description="Add text directly to your clip."
            >

              <div className="editor-property-toggle">

                <div>
                  <Captions size={15} />
                  <span>Show captions</span>
                </div>

                <button
                  className={`editor-toggle ${
                    captionsEnabled
                      ? "editor-toggle-active"
                      : ""
                  }`}
                  onClick={() =>
                    setCaptionsEnabled(
                      !captionsEnabled
                    )
                  }
                  aria-label="Toggle captions"
                >
                  <span />
                </button>

              </div>


              {captionsEnabled && (
                <textarea
                  value={captionText}
                  onChange={(event) =>
                    setCaptionText(
                      event.target.value
                    )
                  }
                  rows="4"
                  className="editor-caption-input"
                />
              )}

            </PropertySection>


            {/* AUDIO */}

            <PropertySection
              title="Source Audio"
              description="Control the original video's volume."
            >

              <div className="editor-volume-heading">

                <div>
                  {volume === 0 ? (
                    <VolumeX size={15} />
                  ) : (
                    <Volume2 size={15} />
                  )}

                  <span>Volume</span>
                </div>

                <strong>
                  {volume}%
                </strong>

              </div>


              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) =>
                  setVolume(
                    Number(event.target.value)
                  )
                }
                className="editor-volume-range"
              />

            </PropertySection>


            {/* AI NOTE */}

            <div className="editor-ai-note">

              <div>
                <Sparkles size={14} />
                <span>AI RECOMMENDATION</span>
              </div>

              <p>
                Vertical 9:16 with captions is
                recommended for short-form social
                platforms.
              </p>

            </div>

          </aside>

        </section>


        {/* TIMELINE */}

        <section className="editor-timeline">

          <div className="editor-timeline-header">

            <div>
              <span>TIMELINE</span>
              <strong>
                {clip.duration} second composition
              </strong>
            </div>

            <div>
              <Scissors size={13} />
              {formatTime(clip.start)}
              {" → "}
              {formatTime(clip.end)}
            </div>

          </div>


          <div className="editor-timeline-content">

            <TimelineRow
              icon={Video}
              title="Video"
            >
              <div className="timeline-video-block">
                <Video size={12} />
                <span>{clip.title}</span>
              </div>
            </TimelineRow>


            {captionsEnabled && (
              <TimelineRow
                icon={Captions}
                title="Captions"
              >
                <div className="timeline-caption-block">
                  <Captions size={12} />

                  <span>
                    {captionText ||
                      "Caption layer"}
                  </span>
                </div>
              </TimelineRow>
            )}


            <TimelineRow
              icon={Volume2}
              title="Audio"
            >
              <div className="timeline-audio-block">
                <Music size={12} />

                <span>
                  Source Audio · {volume}%
                </span>

                <div className="timeline-waveform">
                  {Array.from({
                    length: 30
                  }).map((_, index) => (
                    <span
                      key={index}
                      style={{
                        height: `${
                          4 +
                          ((index * 7) % 13)
                        }px`
                      }}
                    />
                  ))}
                </div>

              </div>
            </TimelineRow>


            <div className="editor-time-markers">

              <span>0s</span>

              <span>
                {Math.round(
                  clip.duration * 0.25
                )}
                s
              </span>

              <span>
                {Math.round(
                  clip.duration * 0.5
                )}
                s
              </span>

              <span>
                {Math.round(
                  clip.duration * 0.75
                )}
                s
              </span>

              <span>
                {clip.duration}s
              </span>

            </div>

          </div>

        </section>

      </div>
    </Layout>
  );
}


function QuickTool({
  icon: Icon,
  label,
  active,
  onClick
}) {
  return (
    <button
      className={`editor-quick-tool ${
        active
          ? "editor-quick-tool-active"
          : ""
      }`}
      onClick={onClick}
    >
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}


function PropertySection({
  title,
  description,
  children
}) {
  return (
    <section className="editor-property-section">

      <div className="editor-property-heading">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      {children}

    </section>
  );
}


function RatioButton({
  icon: Icon,
  label,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`editor-ratio-button ${
        active
          ? "editor-ratio-active"
          : ""
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}


function TimelineRow({
  icon: Icon,
  title,
  children
}) {
  return (
    <div className="editor-timeline-row">

      <div className="timeline-label">
        <Icon size={13} />
        <span>{title}</span>
      </div>

      <div className="timeline-track">
        {children}
      </div>

    </div>
  );
}


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;
}