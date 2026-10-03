import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="workspace-layout">

      <Sidebar />

      <main className="workspace-main">
        {children}
      </main>

    </div>
  );
}