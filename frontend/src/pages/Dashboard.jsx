import Layout from "../components/Layout";
import {
  FolderKanban,
  Clapperboard,
  Clock3,
  Plus,
  ArrowRight,
  Sparkles,
  Play,
  WandSparkles,
  FileText,
  Scissors,
  Upload,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="dashboard-shell">

        {/* HERO */}
        <section className="dashboard-hero">

          <div className="dashboard-hero-copy">

            <div className="dashboard-eyebrow">
              <Sparkles size={14} />
              CREATOR WORKSPACE
            </div>

            <h1 className="dashboard-title">
              Create once.
              <br />
              <span>Shape it everywhere.</span>
            </h1>

            <p className="dashboard-description">
              Turn raw recordings into platform-ready content with an
              AI-assisted creative workflow.
            </p>

            <div className="dashboard-hero-actions">

              <button
                className="primary-button"
                onClick={() => navigate("/new-project")}
              >
                <Plus size={18} />
                New Project
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate("/projects")}
              >
                Browse Projects
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

          <div className="dashboard-ai-orb">

            <div className="ai-orb-glow"></div>

            <div className="ai-orb-core">
              <WandSparkles size={28} />
            </div>

            <div className="ai-orb-copy">
              <span>CREATOR AI</span>
              <strong>Ready to create</strong>
              <p>8 promising moments found</p>
            </div>

          </div>

        </section>


        {/* STATS */}
        <section className="dashboard-stats">

          <StatCard
            icon={FolderKanban}
            title="Active Projects"
            value="12"
            change="+3"
            caption="this week"
          />

          <StatCard
            icon={Clapperboard}
            title="Clips Generated"
            value="48"
            change="+14"
            caption="this week"
          />

          <StatCard
            icon={Clock3}
            title="Production Time Saved"
            value="6.4"
            unit="hrs"
            change="+2.1"
            caption="hours saved"
          />

        </section>


        {/* CONTINUE CREATING */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="section-kicker">
                PICK UP WHERE YOU LEFT OFF
              </p>

              <h2>Continue creating</h2>
            </div>

            <button
              className="dashboard-text-button"
              onClick={() => navigate("/projects")}
            >
              View all
              <ArrowRight size={16} />
            </button>

          </div>


          <div className="featured-project creator-card">

            <div className="featured-project-main">

              <div className="featured-project-icon">
                <Play size={18} fill="currentColor" />
              </div>

              <div>

                <div className="featured-project-tags">
                  <span>Instagram Reel</span>

                  <span className="ai-badge">
                    <Sparkles size={12} />
                    AI Analysis
                  </span>
                </div>

                <h3>Creator Growth Strategy</h3>

                <p>
                  AI found 8 high-potential moments in your latest recording.
                </p>

              </div>

            </div>


            <div className="featured-project-progress">

              <div className="featured-progress-label">
                <span>Project progress</span>
                <strong>65%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "65%" }}
                />
              </div>

              <button
                className="continue-button"
                onClick={() => navigate("/suggestions")}
              >
                Continue
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </section>


        {/* CREATIVE FLOW */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="section-kicker">
                YOUR WORKFLOW
              </p>

              <h2>From idea to publish</h2>
            </div>

            <div className="workflow-status">
              3 of 5 stages active
            </div>

          </div>


          <div className="creative-flow creator-card">

            <FlowStep
              icon={Sparkles}
              title="Idea"
              description="Start with a concept"
              state="complete"
            />

            <FlowLine state="complete" />

            <FlowStep
              icon={FileText}
              title="Script"
              description="Shape your story"
              state="complete"
            />

            <FlowLine state="complete" />

            <FlowStep
              icon={WandSparkles}
              title="Analyze"
              description="Find key moments"
              state="active"
            />

            <FlowLine />

            <FlowStep
              icon={Scissors}
              title="Edit"
              description="Refine your clips"
            />

            <FlowLine />

            <FlowStep
              icon={Upload}
              title="Publish"
              description="Ready everywhere"
            />

          </div>

        </section>


        {/* CREATOR INTELLIGENCE */}
<section className="dashboard-section">

  <div className="dashboard-section-heading">
    <div>
      <p className="section-kicker">AI PERFORMANCE</p>
      <h2>Creator Intelligence</h2>
    </div>

    <div className="creator-intelligence-live">
      <span></span>
      ANALYSIS READY
    </div>
  </div>

  <div className="creator-intelligence-grid">

    <div className="creator-intelligence-metric creator-card">
      <div className="creator-metric-top">
        <Sparkles size={18} />
        <span>TOP HOOK</span>
      </div>

      <h3>
        “Stop scrolling — you're making this mistake.”
      </h3>

      <div className="creator-metric-value">92%</div>

      <p>Predicted hook strength</p>
    </div>


    <div className="creator-intelligence-metric creator-card">
      <div className="creator-metric-top">
        <Clapperboard size={18} />
        <span>BEST CLIP</span>
      </div>

      <h3>Clip #3</h3>

      <div className="creator-metric-value">94/100</div>

      <p>18 sec · High-potential moment</p>
    </div>


    <div className="creator-intelligence-metric creator-card">
      <div className="creator-metric-top">
        <TrendingUp size={18} />
        <span>AVG. ENGAGEMENT</span>
      </div>

      <div className="creator-metric-value creator-metric-large">
        84%
      </div>

      <p>Across AI-generated clips</p>
    </div>


    <div className="creator-intelligence-metric creator-card">
      <div className="creator-metric-top">
        <WandSparkles size={18} />
        <span>CONTENT PATTERN</span>
      </div>

      <h3>Educational + Fast Hook</h3>

      <div className="creator-pattern-tags">
        <span>Short-form</span>
        <span>Fast paced</span>
        <span>Educational</span>
      </div>
    </div>


    <div className="creator-intelligence-metric creator-card creator-time-card">
      <div className="creator-metric-top">
        <Clock3 size={18} />
        <span>PRODUCTION TIME SAVED</span>
      </div>

      <div className="creator-metric-value creator-metric-large">
        2h 34m
      </div>

      <p>72% faster than manual editing</p>

      <div className="creator-time-bar">
        <div style={{ width: "72%" }}></div>
      </div>
    </div>

  </div>

  <div className="creator-intelligence-footer creator-card">

    <div>
      <Sparkles size={18} />

      <div>
        <strong>8 high-potential moments found</strong>
        <p>
          CreatorAI analyzed hooks, clips and content structure.
        </p>
      </div>
    </div>

    <button
      className="intelligence-button"
      onClick={() => navigate("/suggestions")}
    >
      Explore suggestions
      <ArrowRight size={17} />
    </button>

  </div>

</section>


        {/* RECENT PROJECTS */}
        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>
              <p className="section-kicker">
                RECENT ACTIVITY
              </p>

              <h2>Your projects</h2>
            </div>

          </div>

          <div className="dashboard-project-grid">

            <ProjectCard
              name="Creator Growth Strategy"
              platform="Instagram"
              status="AI Analysis"
              progress={65}
            />

            <ProjectCard
              name="Startup Marketing Reel"
              platform="YouTube Shorts"
              status="Ready to Publish"
              progress={100}
            />

            <ProjectCard
              name="Productivity Tips"
              platform="TikTok"
              status="Editing"
              progress={80}
            />

          </div>

        </section>

      </div>
    </Layout>
  );
}


function StatCard({
  icon: Icon,
  title,
  value,
  unit,
  change,
  caption
}) {
  return (
    <div className="dashboard-stat-card">

      <div className="stat-card-top">

        <div className="stat-icon">
          <Icon size={19} />
        </div>

        <div className="stat-change">
          <TrendingUp size={13} />
          {change}
        </div>

      </div>

      <p className="stat-title">
        {title}
      </p>

      <div className="stat-value-row">
        <strong>{value}</strong>
        {unit && <span>{unit}</span>}
      </div>

      <p className="stat-caption">
        {caption}
      </p>

    </div>
  );
}


function FlowStep({
  icon: Icon,
  title,
  description,
  state = "pending"
}) {
  return (
    <div className={`flow-step flow-${state}`}>

      <div className="flow-icon">
        <Icon size={18} />
      </div>

      <strong>{title}</strong>

      <span>{description}</span>

    </div>
  );
}


function FlowLine({ state = "pending" }) {
  return (
    <div className={`flow-line flow-line-${state}`}>
      <span></span>
    </div>
  );
}


function ProjectCard({
  name,
  platform,
  status,
  progress
}) {
  return (
    <div className="dashboard-project-card creator-card">

      <div className="project-card-header">

        <div className="project-mini-icon">
          <Clapperboard size={17} />
        </div>

        <span className="project-status">
          {status}
        </span>

      </div>

      <h3>{name}</h3>

      <p>{platform}</p>

      <div className="project-card-progress">

        <div>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

    </div>
  );
}