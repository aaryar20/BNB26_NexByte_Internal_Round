import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Video,
  X,
  Sparkles,
  Play,
  MonitorPlay,
  Smartphone,
  Check,
  ArrowRight
} from "lucide-react";

import Layout from "../components/Layout";
import { createProject as createBackendProject, uploadAsset } from "../services/api";
export default function NewProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [video, setVideo] = useState(null);
  const [dragging, setDragging] = useState(false);

  function selectVideo(file) {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }

    setVideo(file);
  }

  function handleVideo(event) {
    selectVideo(event.target.files[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];

    selectVideo(file);
  }

  async function createProject() {
    if (!projectName.trim() || !video) {
      alert("Please enter a project name and upload a video.");
      return;
    }

    try {
      // 1. Create the project in the FastAPI backend
      const project = await createBackendProject(
        projectName.trim(),
        `Target platform: ${platform}`
      );

      // 2. Upload the selected video to the backend
      const asset = await uploadAsset(project.id, video);

      // 3. Store the backend project information locally
      //    so the next pages know which project is active.
      localStorage.setItem(
        "currentProject",
        JSON.stringify({
          id: project.id,
          name: project.name,
          platform,
          videoName: video.name,
          assetId: asset.id,
        })
      );

      // 4. Continue to the Assets page
      navigate("/assets");
    } catch (error) {
      console.error("Failed to create project:", error);

      alert(
        error.message ||
          "Something went wrong while creating the project."
      );
    }
  }

  return (
    <Layout>
      <div className="new-project-page">

        {/* BACK */}

        <button
          onClick={() => navigate("/projects")}
          className="new-project-back"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </button>


        {/* HEADER */}

        <section className="new-project-header">

          <div className="new-project-eyebrow">
            <Sparkles size={13} />
            NEW PROJECT
          </div>

          <h1>
            Start something
            <span> worth sharing.</span>
          </h1>

          <p>
            Give your project a name, choose where it's going,
            and upload your source video. CreatorAI will take it
            from there.
          </p>

        </section>


        {/* MAIN CARD */}

        <section className="new-project-card">

          {/* STEP 1 */}

          <div className="new-project-section">

            <div className="new-project-section-heading">

              <span className="new-project-step">
                01
              </span>

              <div>
                <h2>Name your project</h2>

                <p>
                  Choose something you'll recognize later.
                </p>
              </div>

            </div>

            <div className="new-project-input-wrap">

              <input
                type="text"
                value={projectName}
                onChange={(event) =>
                  setProjectName(event.target.value)
                }
                placeholder="e.g. Founder Podcast Episode 12"
                maxLength={80}
              />

              <span>
                {projectName.length}/80
              </span>

            </div>

          </div>


          <div className="new-project-divider" />


          {/* STEP 2 */}

          <div className="new-project-section">

            <div className="new-project-section-heading">

              <span className="new-project-step">
                02
              </span>

              <div>
                <h2>Choose your destination</h2>

                <p>
                  We'll prepare your content for the selected platform.
                </p>
              </div>

            </div>


            <div className="platform-selection">

              <PlatformCard
                name="Instagram"
                description="Reels"
                icon={Play}
                selected={platform === "Instagram"}
                onClick={() => setPlatform("Instagram")}
              />

              <PlatformCard
                name="TikTok"
                description="Vertical video"
                icon={Smartphone}
                selected={platform === "TikTok"}
                onClick={() => setPlatform("TikTok")}
              />

              <PlatformCard
                name="YouTube Shorts"
                description="Shorts"
                icon={MonitorPlay}
                selected={platform === "YouTube Shorts"}
                onClick={() => setPlatform("YouTube Shorts")}
              />

            </div>

            <div className="platform-format-note">
              <Smartphone size={13} />

              Optimized for vertical 9:16 content
            </div>

          </div>


          <div className="new-project-divider" />


          {/* STEP 3 */}

          <div className="new-project-section">

            <div className="new-project-section-heading">

              <span className="new-project-step">
                03
              </span>

              <div>
                <h2>Add your source video</h2>

                <p>
                  Upload the long-form recording you want to transform.
                </p>
              </div>

            </div>


            {!video ? (

              <div
                className={`video-dropzone ${
                  dragging ? "video-dropzone-active" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideo}
                  hidden
                />

                <div className="upload-icon-shell">
                  <Upload size={22} />
                </div>

                <h3>
                  Drop your video here
                </h3>

                <p>
                  or click to browse from your computer
                </p>

                <div className="upload-formats">
                  <span>MP4</span>
                  <span>MOV</span>
                  <span>WebM</span>
                </div>

              </div>

            ) : (

              <div className="uploaded-video">

                <div className="uploaded-video-icon">
                  <Video size={21} />
                </div>


                <div className="uploaded-video-information">

                  <div className="uploaded-video-status">
                    <Check size={11} />
                    READY
                  </div>

                  <h3>
                    {video.name}
                  </h3>

                  <p>
                    {formatFileSize(video.size)}
                    <span>•</span>
                    Video
                  </p>

                </div>


                <button
                  className="remove-video-button"
                  onClick={() => {
                    setVideo(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  aria-label="Remove video"
                >
                  <X size={17} />
                </button>

              </div>

            )}

          </div>


          {/* FOOTER */}

          <div className="new-project-footer">

            <div className="new-project-summary">

              <Sparkles size={14} />

              <span>
                Next, we'll prepare your assets for AI analysis.
              </span>

            </div>

            <button
              onClick={createProject}
              className="create-project-button"
            >
              Create Project
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

      </div>
    </Layout>
  );
}


function PlatformCard({
  name,
  description,
  icon: Icon,
  selected,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`platform-card ${
        selected ? "platform-card-selected" : ""
      }`}
    >

      <div className="platform-card-icon">
        <Icon size={19} />
      </div>

      <div className="platform-card-copy">

        <strong>
          {name}
        </strong>

        <span>
          {description}
        </span>

      </div>

      <div className="platform-check">
        {selected && <Check size={11} />}
      </div>

    </button>
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