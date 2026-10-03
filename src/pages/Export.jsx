import { useNavigate } from "react-router-dom";

import {
  Download,
  CheckCircle2,
  Video,
  Smartphone,
  FileVideo,
  Home,
  FolderOpen,
  Sparkles,
  Scissors,
  Captions,
  Volume2,
  ArrowRight,
  WandSparkles
} from "lucide-react";

import Layout from "../components/Layout";

export default function Export() {
  const navigate = useNavigate();

  const request = JSON.parse(
    localStorage.getItem("renderRequest")
  );

  const result = JSON.parse(
    localStorage.getItem("renderResult")
  );

  const project = JSON.parse(
    localStorage.getItem("currentProject")
  );

  const trimOperation =
    request?.operations?.find(
      (operation) => operation.type === "trim"
    );

  const captionOperation =
    request?.operations?.find(
      (operation) => operation.type === "caption"
    );

  const audioOperation =
    request?.operations?.find(
      (operation) => operation.type === "audio"
    );

  function downloadVideo() {
    /*
      Hackathon fallback:
      Member 3's rendered MP4 URL will replace this
      once the video processing service is connected.
    */

    const content = [
      "CreatorAI Hackathon Demo",
      "",
      "Render Status: Completed",
      `Project: ${project?.name || "CreatorAI Clip"}`,
      `Format: ${request?.format || "9:16"}`,
      `Operations: ${request?.operations?.length || 0}`,
      `Output: ${
        result?.video_url || "/outputs/clip001.mp4"
      }`
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "creatorAI-demo-render.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <div className="export-page">

        {/* SUCCESS HERO */}

        <section className="export-success">

          <div className="export-success-icon">
            <CheckCircle2 size={29} />
          </div>

          <div className="export-eyebrow">
            <Sparkles size={14} />
            EXPORT READY
          </div>

          <h1>
            Your clip is
            <span> ready to share.</span>
          </h1>

          <p>
            Your edit has been prepared with the selected
            format, captions and audio settings. One final
            download and you're ready to publish.
          </p>

        </section>


        {/* RESULT */}

        <section className="export-result-card">

          <div className="export-video-thumbnail">

            <div className="export-thumbnail-glow" />

            <Video size={31} />

            <span>
              {request?.format || "9:16"}
            </span>

          </div>


          <div className="export-video-information">

            <div className="export-final-label">
              FINAL VIDEO
            </div>

            <h2>
              {project?.name || "CreatorAI Clip"}
            </h2>

            <div className="export-video-meta">

              <span>
                <Smartphone size={15} />
                {request?.format || "9:16"}
              </span>

              <span>
                <FileVideo size={15} />
                MP4
              </span>

              <span>
                <Scissors size={15} />
                {request?.operations?.length || 0} edits
              </span>

            </div>


            <div className="export-render-status">
              <span />
              Render completed
            </div>

          </div>


          <button
            className="export-download-button"
            onClick={downloadVideo}
          >
            <Download size={17} />
            Download
          </button>

        </section>


        {/* DETAILS */}

        <section className="export-details">

          <Detail
            title="Status"
            value={
              result?.status
                ? capitalize(result.status)
                : "Completed"
            }
          />

          <Detail
            title="Format"
            value={request?.format || "9:16"}
          />

          <Detail
            title="Edits Applied"
            value={
              request?.operations?.length || 0
            }
          />

        </section>


        {/* EDIT RECIPE */}

        <section className="export-recipe">

          <div className="export-recipe-heading">

            <div>
              <span>FINAL EDIT RECIPE</span>
              <h2>What CreatorAI prepared</h2>
            </div>

            <WandSparkles size={19} />

          </div>


          <div className="export-recipe-grid">

            <RecipeItem
              icon={Scissors}
              title="Trim"
              value={
                trimOperation
                  ? `${formatTime(
                      trimOperation.start
                    )} → ${formatTime(
                      trimOperation.end
                    )}`
                  : "Original"
              }
            />

            <RecipeItem
              icon={Captions}
              title="Captions"
              value={
                captionOperation
                  ? "Enabled"
                  : "Disabled"
              }
            />

            <RecipeItem
              icon={Volume2}
              title="Source Audio"
              value={`${
                audioOperation?.volume ?? 100
              }%`}
            />

            <RecipeItem
              icon={Smartphone}
              title="Aspect Ratio"
              value={request?.format || "9:16"}
            />

          </div>

        </section>


        {/* COMPLETE FLOW */}

        <section className="export-complete-banner">

          <div className="export-complete-copy">

            <div className="export-complete-icon">
              <Sparkles size={18} />
            </div>

            <div>
              <span>WORKFLOW COMPLETE</span>

              <h2>
                From long-form content to a
                publish-ready clip.
              </h2>

              <p>
                Start another project or return to your
                workspace to manage existing content.
              </p>
            </div>

          </div>


          <div className="export-navigation">

            <button
              className="export-secondary-button"
              onClick={() =>
                navigate("/projects")
              }
            >
              <FolderOpen size={16} />
              Projects
            </button>

            <button
              className="export-primary-button"
              onClick={() => navigate("/")}
            >
              <Home size={16} />
              Dashboard
              <ArrowRight size={14} />
            </button>

          </div>

        </section>

      </div>
    </Layout>
  );
}


function Detail({ title, value }) {
  return (
    <article className="export-detail-card">

      <span>{title}</span>

      <strong>{value}</strong>

    </article>
  );
}


function RecipeItem({
  icon: Icon,
  title,
  value
}) {
  return (
    <div className="export-recipe-item">

      <div className="export-recipe-icon">
        <Icon size={16} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <CheckCircle2 size={16} />

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


function capitalize(value) {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}