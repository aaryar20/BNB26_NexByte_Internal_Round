import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Music,
  MoreHorizontal,
  Sparkles,
  Play,
  CheckCircle2,
  ArrowRight,
  FolderOpen,
  FileVideo,
  Clock3,
  X
} from "lucide-react";

import Layout from "../components/Layout";

export default function AssetLibrary() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Videos");
  const [extraAssets, setExtraAssets] = useState([]);

  const savedProject = JSON.parse(
    localStorage.getItem("currentProject")
  );

  function analyzeVideo() {
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  }

  function continueToResults() {
    navigate("/script");
  }

  function handleAssetUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const newAssets = files.map((file, index) => {
      let type = "Other";

      if (file.type.startsWith("video/")) type = "Videos";
      if (file.type.startsWith("image/")) type = "Images";
      if (file.type.startsWith("audio/")) type = "Audio";

      return {
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type,
        file
      };
    });

    setExtraAssets((current) => [
      ...current,
      ...newAssets.filter((asset) => asset.type !== "Other")
    ]);

    event.target.value = "";
  }

  function removeAsset(id) {
    setExtraAssets((current) =>
      current.filter((asset) => asset.id !== id)
    );
  }

  const filteredAssets = extraAssets.filter(
    (asset) => asset.type === activeFilter
  );

  const showSourceVideo = activeFilter === "Videos";

  return (
    <Layout>
      <div className="asset-library-page">

        {/* HEADER */}

        <section className="asset-library-header">

          <div>
            <div className="asset-library-eyebrow">
              <FolderOpen size={13} />
              ASSET LIBRARY
            </div>

            <h1>
              Your creative
              <span> ingredients.</span>
            </h1>

            <p>
              Keep every video, image and audio file for your project
              organized in one beautiful workspace.
            </p>
          </div>

          <button
            className="asset-upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Upload Asset
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*,audio/*"
            multiple
            hidden
            onChange={handleAssetUpload}
          />

        </section>


        {/* PROJECT INFORMATION */}

        {savedProject && (
          <section className="asset-project-strip">

            <div className="asset-project-main">

              <div className="asset-project-icon">
                <FileVideo size={18} />
              </div>

              <div>
                <span>ACTIVE PROJECT</span>
                <strong>{savedProject.name}</strong>
              </div>

            </div>

            <div className="asset-project-divider" />

            <ProjectDetail
              label="Platform"
              value={savedProject.platform}
            />

            <div className="asset-project-divider" />

            <ProjectDetail
              label="Source"
              value={savedProject.videoName}
              truncate
            />

          </section>
        )}


        {/* LIBRARY TOOLBAR */}

        <section className="asset-toolbar">

          <div className="asset-filters">

            <FilterButton
              icon={Video}
              text="Videos"
              active={activeFilter === "Videos"}
              onClick={() => setActiveFilter("Videos")}
            />

            <FilterButton
              icon={ImageIcon}
              text="Images"
              active={activeFilter === "Images"}
              onClick={() => setActiveFilter("Images")}
            />

            <FilterButton
              icon={Music}
              text="Audio"
              active={activeFilter === "Audio"}
              onClick={() => setActiveFilter("Audio")}
            />

          </div>

          <span className="asset-count">
            {activeFilter === "Videos"
              ? filteredAssets.length + 1
              : filteredAssets.length}{" "}
            {activeFilter.toLowerCase()}
          </span>

        </section>


        {/* ASSET GRID */}

        <section className="asset-grid">

          {showSourceVideo && (
            <SourceVideoCard
              fileName={
                savedProject?.videoName || "source-video.mp4"
              }
            />
          )}

          {filteredAssets.map((asset) => (
            <UploadedAssetCard
              key={asset.id}
              asset={asset}
              onRemove={() => removeAsset(asset.id)}
            />
          ))}

          {!showSourceVideo && filteredAssets.length === 0 && (
            <div className="asset-empty-state">

              <div className="asset-empty-icon">
                {activeFilter === "Images" ? (
                  <ImageIcon size={20} />
                ) : (
                  <Music size={20} />
                )}
              </div>

              <h3>
                No {activeFilter.toLowerCase()} yet
              </h3>

              <p>
                Upload an asset and it will appear here.
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Upload {activeFilter}
              </button>

            </div>
          )}

        </section>


        {/* AI ANALYSIS */}

        <section className="asset-ai-panel">

          {!analyzing && !analysisComplete && (
            <div className="asset-ai-ready">

              <div className="asset-ai-copy">

                <div className="asset-ai-icon">
                  <Sparkles size={19} />
                </div>

                <div>
                  <span className="asset-ai-label">
                    CREATOR INTELLIGENCE
                  </span>

                  <h2>
                    Ready for AI analysis.
                  </h2>

                  <p>
                    Let CreatorAI study your source video, generate
                    the transcript and discover the moments most
                    likely to become strong short-form clips.
                  </p>
                </div>

              </div>

              <button
                onClick={analyzeVideo}
                className="asset-analyze-button"
              >
                <Sparkles size={15} />
                Analyze Video
                <ArrowRight size={14} />
              </button>

            </div>
          )}


          {/* ANALYZING */}

          {analyzing && (
            <div className="asset-analyzing">

              <div className="asset-analysis-heading">

                <div className="asset-analysis-spinner">
                  <Sparkles size={17} />
                </div>

                <div>
                  <span className="asset-ai-label">
                    CREATOR INTELLIGENCE
                  </span>

                  <h2>
                    Understanding your content...
                  </h2>

                  <p>
                    CreatorAI is finding the strongest moments
                    in your video.
                  </p>
                </div>

              </div>


              <div className="asset-analysis-progress">

                <div className="analysis-progress-track">
                  <div className="analysis-progress-fill" />
                </div>

                <div className="analysis-steps">

                  <AnalysisStep
                    text="Upload received"
                    complete
                  />

                  <AnalysisStep
                    text="Audio extracted"
                    complete
                  />

                  <AnalysisStep
                    text="Generating transcript"
                    active
                  />

                  <AnalysisStep
                    text="Detecting hooks"
                  />

                  <AnalysisStep
                    text="Creating clip suggestions"
                  />

                </div>

              </div>

            </div>
          )}


          {/* COMPLETE */}

          {analysisComplete && (
            <div className="asset-analysis-complete">

              <div className="asset-complete-copy">

                <div className="asset-complete-icon">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <span className="asset-complete-label">
                    ANALYSIS COMPLETE
                  </span>

                  <h2>
                    Your best moments are ready.
                  </h2>

                  <p>
                    CreatorAI found 8 high-potential moments and
                    generated your transcript.
                  </p>
                </div>

              </div>

              <button
                onClick={continueToResults}
                className="asset-results-button"
              >
                View Results
                <ArrowRight size={15} />
              </button>

            </div>
          )}

        </section>

      </div>
    </Layout>
  );
}


function ProjectDetail({ label, value, truncate }) {
  return (
    <div className="asset-project-detail">
      <span>{label}</span>

      <strong className={truncate ? "asset-truncate" : ""}>
        {value}
      </strong>
    </div>
  );
}


function FilterButton({
  icon: Icon,
  text,
  active,
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className={`asset-filter-button ${
        active ? "asset-filter-active" : ""
      }`}
    >
      <Icon size={14} />
      {text}
    </button>
  );
}


function SourceVideoCard({ fileName }) {
  return (
    <article className="asset-card">

      <div className="asset-video-preview">

        <div className="asset-preview-decoration asset-decoration-one" />
        <div className="asset-preview-decoration asset-decoration-two" />

        <button
          className="asset-play-button"
          aria-label="Preview source video"
        >
          <Play size={18} fill="currentColor" />
        </button>

        <div className="asset-source-badge">
          ORIGINAL
        </div>

        <div className="asset-video-duration">
          Source Video
        </div>

      </div>


      <div className="asset-card-information">

        <div className="asset-file-icon">
          <Video size={16} />
        </div>

        <div className="asset-file-copy">

          <h3 title={fileName}>
            {fileName}
          </h3>

          <p>
            Original upload
          </p>

        </div>

        <button className="asset-more-button">
          <MoreHorizontal size={17} />
        </button>

      </div>

    </article>
  );
}


function UploadedAssetCard({ asset, onRemove }) {
  const Icon =
    asset.type === "Videos"
      ? Video
      : asset.type === "Images"
      ? ImageIcon
      : Music;

  return (
    <article className="asset-card uploaded-asset-card">

      <div className="uploaded-asset-preview">

        <Icon size={28} />

        <span>
          {asset.type.slice(0, -1)}
        </span>

      </div>

      <div className="asset-card-information">

        <div className="asset-file-icon">
          <Icon size={16} />
        </div>

        <div className="asset-file-copy">

          <h3 title={asset.name}>
            {asset.name}
          </h3>

          <p>
            {formatFileSize(asset.size)}
          </p>

        </div>

        <button
          className="asset-more-button asset-remove-button"
          onClick={onRemove}
          aria-label="Remove asset"
        >
          <X size={15} />
        </button>

      </div>

    </article>
  );
}


function AnalysisStep({
  text,
  complete,
  active
}) {
  return (
    <div
      className={`analysis-step ${
        complete
          ? "analysis-step-complete"
          : active
          ? "analysis-step-active"
          : ""
      }`}
    >

      <span className="analysis-step-indicator">
        {complete ? (
          <CheckCircle2 size={12} />
        ) : active ? (
          <Clock3 size={11} />
        ) : (
          <span />
        )}
      </span>

      {text}

    </div>
  );
}


function formatFileSize(bytes) {
  if (!bytes) return "0 MB";

  const mb = bytes / 1024 / 1024;

  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${mb.toFixed(2)} MB`;
}