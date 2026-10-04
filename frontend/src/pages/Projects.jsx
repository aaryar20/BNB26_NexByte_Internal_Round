import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  ArrowRight,
  FolderKanban,
  Sparkles,
  Clock3,
  SlidersHorizontal
} from "lucide-react";

import Layout from "../components/Layout";
import { getProjects } from "../services/mockApi";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Projects");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.platform
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All Projects" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <Layout>
      <div className="projects-page">

        {/* PAGE HEADER */}

        <section className="projects-header">

          <div>
            <div className="projects-eyebrow">
              <FolderKanban size={14} />
              CREATOR WORKSPACE
            </div>

            <h1 className="projects-title">
              Your projects.
            </h1>

            <p className="projects-description">
              Everything you're creating, from the first idea to the final
              publish.
            </p>
          </div>

          <button
            onClick={() => navigate("/new-project")}
            className="projects-new-button"
          >
            <Plus size={18} />
            New Project
          </button>

        </section>


        {/* QUICK OVERVIEW */}

        <section className="projects-overview">

          <OverviewItem
            icon={FolderKanban}
            value={projects.length}
            label="Total projects"
          />

          <div className="overview-divider" />

          <OverviewItem
            icon={Sparkles}
            value={
              projects.filter(
                (project) => project.status === "AI Analysis"
              ).length
            }
            label="In AI analysis"
          />

          <div className="overview-divider" />

          <OverviewItem
            icon={Clock3}
            value={
              projects.filter(
                (project) => project.status === "Ready to Publish"
              ).length
            }
            label="Ready to publish"
          />

        </section>


        {/* SEARCH + FILTER */}

        <section className="projects-toolbar">

          <div className="projects-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>


          <div className="projects-filter">

            <SlidersHorizontal size={16} />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option>All Projects</option>
              <option>AI Analysis</option>
              <option>Editing</option>
              <option>Ready to Publish</option>
            </select>

          </div>

        </section>


        {/* CONTENT */}

        {loading ? (

          <ProjectsLoading />

        ) : filteredProjects.length > 0 ? (

          <section className="projects-grid">

            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}

          </section>

        ) : (

          <section className="projects-empty">

            <div className="projects-empty-icon">
              <Search size={22} />
            </div>

            <h2>No projects found</h2>

            <p>
              Try changing your search or project filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All Projects");
              }}
            >
              Clear filters
            </button>

          </section>

        )}

      </div>
    </Layout>
  );
}


function OverviewItem({ icon: Icon, value, label }) {
  return (
    <div className="overview-item">

      <div className="overview-icon">
        <Icon size={17} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

    </div>
  );
}


function ProjectCard({ project, index }) {
  const navigate = useNavigate();

  const openProject = () => {
    /*
      For now we send the user into the existing workspace.
      Tomorrow this can become:
      navigate(`/projects/${project.id}`)
    */
    navigate("/suggestions");
  };

  return (
    <article
      className="project-glass-card"
      style={{
        animationDelay: `${index * 70}ms`
      }}
    >

      {/* TOP */}

      <div className="project-card-top">

        <div className="project-letter">
          {project.name.charAt(0)}
        </div>

        <button
          className="project-more-button"
          aria-label="Project options"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal size={18} />
        </button>

      </div>


      {/* INFORMATION */}

      <div className="project-card-content">

        <div className="project-platform">
          {project.platform}
        </div>

        <h2>{project.name}</h2>

        <div className="project-status-row">

          <span className="project-status-pill">
            <span className="project-status-dot" />
            {project.status}
          </span>

          <span className="project-progress-number">
            {project.progress}%
          </span>

        </div>


        <div className="project-progress-track">

          <div
            className="project-progress-fill"
            style={{
              width: `${project.progress}%`
            }}
          />

        </div>

      </div>


      {/* FOOTER */}

      <div className="project-card-footer">

        <div className="project-updated">
          <Clock3 size={13} />
          Updated {project.updated}
        </div>

        <button
          className="project-open-button"
          onClick={openProject}
        >
          Open
          <ArrowRight size={15} />
        </button>

      </div>

    </article>
  );
}


function ProjectsLoading() {
  return (
    <section className="projects-loading">

      {[1, 2, 3].map((item) => (
        <div
          className="project-skeleton"
          key={item}
        >
          <div className="skeleton-circle" />
          <div className="skeleton-line skeleton-large" />
          <div className="skeleton-line skeleton-small" />
          <div className="skeleton-line skeleton-progress" />
        </div>
      ))}

    </section>
  );
}