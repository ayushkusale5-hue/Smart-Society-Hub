import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AIAssistantWidget from "./AIAssistantWidget";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 90,
            backdropFilter: 'blur(2px)',
          }}
          className="lg:hidden"
        />
      )}

      <div className="main-content">
        <Topbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      <AIAssistantWidget />
    </div>
  );
}
