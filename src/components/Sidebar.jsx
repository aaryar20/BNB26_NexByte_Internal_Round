import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Library,
  FileText,
  Sparkles,
  Clapperboard,
  Scissors,
  Download,
  Play,
  ChevronRight
} from "lucide-react";

const workspaceItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban
  },
  {
    name: "Asset Library",
    path: "/assets",
    icon: Library
  },
  {
    name: "Script View",
    path: "/script",
    icon: FileText
  }
];

const creationItems = [
  {
    name: "AI Suggestions",
    path: "/suggestions",
    icon: Sparkles
  },
  {
    name: "Clip Gallery",
    path: "/clips",
    icon: Clapperboard
  },
  {
    name: "Editor",
    path: "/editor",
    icon: Scissors
  },
  {
    name: "Export",
    path: "/export",
    icon: Download
  }
];

function NavigationItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        `creator-nav-item ${
          isActive ? "creator-nav-active" : ""
        }`
      }
    >
      <span className="creator-nav-icon">
        <Icon size={18} strokeWidth={1.9} />
      </span>

      <span className="creator-nav-name">
        {item.name}
      </span>

      <ChevronRight
        size={15}
        className="creator-nav-arrow"
      />
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="creator-sidebar">

      <div className="creator-sidebar-header">

        <div className="creator-logo-row">

          <div className="creator-logo-mark">
            <Play
              size={16}
              fill="currentColor"
            />
          </div>

          <div>
            <h1 className="creator-logo">
              Creator<span>AI</span>
            </h1>

            <p className="creator-logo-subtitle">
              AI CREATIVE STUDIO
            </p>
          </div>

        </div>

      </div>

      <div className="sidebar-scroll-area">

        <div className="sidebar-section">

          <p className="sidebar-section-title">
            WORKSPACE
          </p>

          <nav className="creator-nav">
            {workspaceItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
              />
            ))}
          </nav>

        </div>

        <div className="sidebar-section">

          <div className="sidebar-section-heading">

            <p className="sidebar-section-title">
              CREATE
            </p>

            <span className="ai-mini-badge">
              AI
            </span>

          </div>

          <nav className="creator-nav">
            {creationItems.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
              />
            ))}
          </nav>

        </div>

      </div>

      <div className="sidebar-bottom-card">

        <div className="sidebar-ai-icon">
          <Sparkles size={17} />
        </div>

        <div className="sidebar-bottom-content">

          <p className="sidebar-bottom-title">
            AI is ready
          </p>

          <p className="sidebar-bottom-text">
            Turn your next idea into content.
          </p>

        </div>

      </div>

    </aside>
  );
}