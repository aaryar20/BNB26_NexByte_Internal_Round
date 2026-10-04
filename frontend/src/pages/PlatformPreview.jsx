import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Play,
  Pause,
  ArrowLeft,
  WandSparkles,
  Smartphone,
  Monitor,
  Square,
  CheckCircle2,
  Loader2,
  Sparkles,
  Video,
  Captions,
  Scissors,
  Volume2,
  ArrowRight,
  Clock3
} from "lucide-react";

import Layout from "../components/Layout";

export default function PlatformPreview() {
  const navigate = useNavigate();

  const request = JSON.parse(
    localStorage.getItem("renderRequest")
  );

  const project = JSON.parse(
    localStorage.getItem("currentProject")
  );

  const [platform, setPlatform] = useState(
    project?.platform || "Instagram"
  );

  const [rendering, setRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [playing, setPlaying] = useState(false);

  const captionOperation =
    request?.operations?.find(
      (operation) => operation.type === "caption"
    );

  const trimOperation =
    request?.operations?.find(
      (operation) => operation.type === "trim"
    );

  const audioOperation =
    request?.operations?.find(
      (operation) => operation.type === "audio"
    );

  function renderVideo() {
    setRendering(true);
    setRenderComplete(false);

    setTimeout(() => {
      setRendering(false);
      setRenderComplete(true);

      localStorage.setItem(
        "renderResult",
        JSON.stringify({
          status: "completed",
          video_url: "/outputs/clip001.mp4",
          platform,
          format: request?.format || "9:16"
        })
      );
    }, 3000);
  }

  function continueToExport() {
    navigate("/export");
  }

  return (
    <Layout>
      <div className="platform-preview-page">

        {/* HEADER */}

        <section className="platform-preview-header">

          <div>
            <div className="platform-preview-eyebrow">
              <Sparkles size={14} />
              PLATFORM PREVIEW
            </div>

            <h1>
              See it before
              <span> you share it.</span>
            </h1>

            <p>
              Preview how your finished clip will appear across
              short-form platforms before creating the final render.
            </p>
          </div>

          <button
            className="platform-back-button"
            onClick={() => navigate("/editor")}
          >
            <ArrowLeft size={16} />
            Back to Editor
          </button>

        </section>


        {/* PLATFORM SELECTOR */}

        <section className="platform-selector">

          <div className="platform-selector-copy">
            <span>PREVIEW PLATFORM</span>
            <strong>Choose a destination</strong>
          </div>

          <div className="platform-options">

            <PlatformButton
              name="Instagram"
              icon={Smartphone}
              active={platform === "Instagram"}
              onClick={() =>
                setPlatform("Instagram")
              }
            />

            <PlatformButton
              name="TikTok"
              icon={Video}
              active={platform === "TikTok"}
              onClick={() =>
                setPlatform("TikTok")
              }
            />

            <PlatformButton
              name="YouTube Shorts"
              icon={Play}
              active={
                platform === "YouTube Shorts"
              }
              onClick={() =>
                setPlatform("YouTube Shorts")
              }
            />

          </div>

        </section>


        {/* MAIN */}

        <section className="platform-preview-workspace">

          {/* PREVIEW */}

          <div className="platform-device-area">

            <div className="platform-device-heading">

              <div>
                <span>LIVE MOCKUP</span>
                <h2>{platform} Preview</h2>
              </div>

              <div className="platform-ready-badge">
                <span />
                Ready to render
              </div>

            </div>


            <div className="platform-canvas">

              <div
                className={`platform-video-frame ${
                  request?.format === "16:9"
                    ? "platform-frame-wide"
                    : request?.format === "1:1"
                    ? "platform-frame-square"
                    : "platform-frame-vertical"
                }`}
              >

                <div className="platform-video-background" />


                {/* TOP MOCK PLATFORM UI */}

                <div className="platform-video-top">

                  <div className="platform-profile">

                    <div className="platform-avatar">
                      C
                    </div>

                    <div>
                      <strong>CreatorAI</strong>
                      <span>{platform}</span>
                    </div>

                  </div>

                  <span className="platform-format-chip">
                    {request?.format || "9:16"}
                  </span>

                </div>


                {/* PLAY */}

                <button
                  className="platform-play-button"
                  onClick={() =>
                    setPlaying(!playing)
                  }
                >
                  {playing ? (
                    <Pause
                      size={23}
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      size={23}
                      fill="currentColor"
                    />
                  )}
                </button>


                {/* CAPTION */}

                {captionOperation && (
                  <div className="platform-caption">
                    <span>
                      {captionOperation.text}
                    </span>
                  </div>
                )}


                {/* SOCIAL MOCKUP */}

                <div className="platform-social-actions">

                  <div>
                    <span>♡</span>
                    <small>12.8K</small>
                  </div>

                  <div>
                    <span>◯</span>
                    <small>482</small>
                  </div>

                  <div>
                    <span>↗</span>
                    <small>Share</small>
                  </div>

                </div>


                <div className="platform-video-footer">

                  <strong>
                    @{project?.name
                      ? project.name
                          .toLowerCase()
                          .replace(/\s+/g, "")
                      : "creator"}
                  </strong>

                  <p>
                    AI-assisted edit · Created with
                    CreatorAI
                  </p>

                </div>

              </div>

            </div>


            <div className="platform-preview-note">
              <Sparkles size={14} />

              <p>
                This is a visual platform mockup. The
                final video will be generated when you
                click <strong>Render Final Video</strong>.
              </p>
            </div>

          </div>


          {/* RIGHT PANEL */}

          <aside className="platform-summary-panel">

            {/* EXPORT SUMMARY */}

            <section className="platform-summary-card">

              <div className="platform-card-heading">
                <div>
                  <span>OUTPUT</span>
                  <h2>Export Summary</h2>
                </div>

                <WandSparkles size={18} />
              </div>


              <PreviewInfo
                icon={Smartphone}
                title="Platform"
                value={platform}
              />

              <PreviewInfo
                icon={
                  request?.format === "16:9"
                    ? Monitor
                    : request?.format === "1:1"
                    ? Square
                    : Smartphone
                }
                title="Format"
                value={request?.format || "9:16"}
              />

              <PreviewInfo
                icon={Video}
                title="Source"
                value={
                  request?.source || "video.mp4"
                }
              />

              <PreviewInfo
                icon={Scissors}
                title="Operations"
                value={`${
                  request?.operations?.length || 0
                } edits`}
              />

            </section>


            {/* EDIT RECIPE */}

            <section className="platform-summary-card">

              <div className="platform-card-heading">
                <div>
                  <span>EDIT RECIPE</span>
                  <h2>Applied changes</h2>
                </div>
              </div>


              {trimOperation && (
                <Operation
                  icon={Scissors}
                  title="Trim"
                  value={`${formatTime(
                    trimOperation.start
                  )} → ${formatTime(
                    trimOperation.end
                  )}`}
                />
              )}


              {captionOperation && (
                <Operation
                  icon={Captions}
                  title="Captions"
                  value="Enabled"
                />
              )}


              {audioOperation && (
                <Operation
                  icon={Volume2}
                  title="Source Audio"
                  value={`${audioOperation.volume}%`}
                />
              )}

            </section>


            {/* OPTIMIZATION */}

            <section className="platform-optimization-card">

              <div className="platform-card-heading">
                <div>
                  <span>CHECKS</span>
                  <h2>Platform Optimization</h2>
                </div>
              </div>

              <Optimization
                icon={Smartphone}
                text="Mobile optimized"
              />

              <Optimization
                icon={Captions}
                text="Safe caption area"
              />

              <Optimization
                icon={Monitor}
                text="High quality output"
              />

            </section>


            {/* RENDER AREA */}

            <section className="platform-render-area">

              {!rendering &&
                !renderComplete && (
                  <button
                    className="platform-render-button"
                    onClick={renderVideo}
                  >
                    <WandSparkles size={17} />
                    Render Final Video
                    <ArrowRight size={15} />
                  </button>
                )}


              {rendering && (
                <div className="platform-rendering">

                  <div className="platform-rendering-icon">
                    <Loader2
                      size={21}
                      className="platform-spinner"
                    />
                  </div>

                  <div>
                    <strong>
                      Rendering your video
                    </strong>

                    <span>
                      Applying your edits and
                      optimization settings.
                    </span>
                  </div>

                  <div className="platform-render-progress">
                    <span />
                  </div>

                </div>
              )}


              {renderComplete && (
                <div className="platform-render-complete">

                  <div className="platform-complete-message">

                    <div>
                      <CheckCircle2 size={19} />
                    </div>

                    <div>
                      <strong>
                        Render Complete
                      </strong>

                      <span>
                        Your video is ready to export.
                      </span>
                    </div>

                  </div>


                  <button
                    onClick={continueToExport}
                  >
                    Continue to Export
                    <ArrowRight size={15} />
                  </button>

                </div>
              )}

            </section>

          </aside>

        </section>

      </div>
    </Layout>
  );
}


function PlatformButton({
  name,
  icon: Icon,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`platform-option ${
        active
          ? "platform-option-active"
          : ""
      }`}
    >
      <Icon size={16} />
      <span>{name}</span>

      {active && (
        <CheckCircle2 size={14} />
      )}
    </button>
  );
}


function PreviewInfo({
  icon: Icon,
  title,
  value
}) {
  return (
    <div className="platform-info-row">

      <div className="platform-info-icon">
        <Icon size={15} />
      </div>

      <div>
        <span>{title}</span>
        <strong title={value}>
          {value}
        </strong>
      </div>

    </div>
  );
}


function Operation({
  icon: Icon,
  title,
  value
}) {
  return (
    <div className="platform-operation">

      <div>
        <Icon size={14} />

        <span>{title}</span>
      </div>

      <strong>{value}</strong>

    </div>
  );
}


function Optimization({
  icon: Icon,
  text
}) {
  return (
    <div className="platform-optimization">

      <div>
        <Icon size={15} />
        <span>{text}</span>
      </div>

      <CheckCircle2 size={15} />

    </div>
  );
}


function formatTime(seconds = 0) {
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