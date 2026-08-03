import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Shield,
  Wrench,
  ShoppingBag,
  Bell,
  FileText,
  Calendar,
  Car,
  Vote,
  Search,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  LogOut,
  Settings,
  X,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth.service";
import toast from "react-hot-toast";

const ROLE_MENUS = {
  resident: [
    { label: "Dashboard", icon: Home, to: "/dashboard/resident" },
    { label: "Visitor Passes", icon: Users, to: "/visitors" },
    { label: "Complaints", icon: Wrench, to: "/complaints" },
    { label: "Maintenance Bill", icon: FileText, to: "/billing" },
    { label: "Facility Booking", icon: Calendar, to: "/facilities" },
    { label: "Parking", icon: Car, to: "/parking" },
    { label: "Notice Board", icon: Bell, to: "/notices" },
    { label: "Polls & Voting", icon: Vote, to: "/polls" },
    { label: "Events", icon: Calendar, to: "/events" },
    { label: "Marketplace", icon: ShoppingBag, to: "/marketplace" },
    { label: "Lost & Found", icon: Search, to: "/lost-found" },
    { label: "Community Chat", icon: MessageSquare, to: "/chat" },
  ],
  committee: [
    { label: "Dashboard", icon: BarChart3, to: "/dashboard/committee" },
    { label: "Residents", icon: Users, to: "/residents" },
    { label: "Visitors", icon: Shield, to: "/visitors/all" },
    { label: "Complaints", icon: Wrench, to: "/complaints/manage" },
    { label: "Billing", icon: FileText, to: "/billing/manage" },
    { label: "Notice Board", icon: Bell, to: "/notices/manage" },
    { label: "Polls", icon: Vote, to: "/polls/manage" },
    { label: "Events", icon: Calendar, to: "/events/manage" },
    { label: "Facilities", icon: Building2, to: "/facilities/manage" },
    { label: "Parking", icon: Car, to: "/parking/manage" },
    { label: "Vendors", icon: ShoppingBag, to: "/vendors" },
    { label: "Analytics", icon: BarChart3, to: "/analytics" },
  ],
  security: [
    { label: "Dashboard", icon: Home, to: "/dashboard/security" },
    { label: "Visitor Gate", icon: Shield, to: "/visitors/gate" },
    { label: "Expected Visitors", icon: Users, to: "/visitors/expected" },
    { label: "Incident Reports", icon: AlertTriangle, to: "/incidents" },
    { label: "Vehicle Logs", icon: Car, to: "/vehicles" },
    { label: "Emergency SOS", icon: AlertTriangle, to: "/sos" },
  ],
  maintenance: [
    { label: "Dashboard", icon: Home, to: "/dashboard/maintenance" },
    { label: "My Tasks", icon: Wrench, to: "/tasks" },
    { label: "Complaints", icon: AlertTriangle, to: "/complaints/assigned" },
    { label: "Task History", icon: FileText, to: "/tasks/history" },
  ],
  vendor: [
    { label: "Dashboard", icon: Home, to: "/dashboard/vendor" },
    { label: "Service Requests", icon: Wrench, to: "/service-requests" },
    { label: "My Jobs", icon: FileText, to: "/jobs" },
    { label: "Upload Bills", icon: FileText, to: "/bills" },
  ],
};

const ROLE_COLORS = {
  resident: "#6366f1",
  committee: "#7c3aed",
  security: "#2563eb",
  maintenance: "#d97706",
  vendor: "#059669",
};

const ROLE_LABELS = {
  resident: "Resident",
  committee: "Committee",
  security: "Security Guard",
  maintenance: "Maintenance",
  vendor: "Vendor",
};

const ROLE_BG = {
  resident: "#eef2ff",
  committee: "#f5f3ff",
  security: "#eff6ff",
  maintenance: "#fffbeb",
  vendor: "#f0fdf4",
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const menuItems = ROLE_MENUS[user?.role] || [];
  const accentColor = ROLE_COLORS[user?.role] || "#6366f1";
  const accentBg = ROLE_BG[user?.role] || "#eef2ff";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    clearAuth();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <>
      {
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {
        <div
          style={{
            padding: "24px 20px 16px",
            borderBottom: "1px solid #e8ecf4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: 'none' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 16,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                boxShadow: `0 4px 12px ${accentColor}40`,
              }}
            >
              S
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#0f172a",
                  lineHeight: 1.2,
                }}
              >
                Smart Society
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: accentColor,
                  marginTop: 2,
                }}
              >
                Hub
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {
        <div
          style={{
            margin: "16px 14px",
            padding: "16px",
            borderRadius: 16,
            background: accentBg,
            border: `1px solid ${accentColor}18`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                flexShrink: 0,
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.firstName} {user?.lastName}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: `${accentColor}18`,
                    color: accentColor,
                    border: `1px solid ${accentColor}28`,
                  }}
                >
                  {ROLE_LABELS[user?.role]}
                </span>
                {user?.flatNumber && (
                  <span style={{ fontSize: 11.5, color: "#9ca3af" }}>
                    #{user.flatNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {
        <div style={{ padding: "12px 22px 8px" }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Navigation
          </span>
        </div>

        {
        <nav style={{ flex: 1, padding: "0 8px 16px", overflowY: "auto" }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: accentBg,
                      color: accentColor,
                      borderColor: `${accentColor}30`,
                      fontWeight: 700,
                    }
                  : {}
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "transparent",
                  flexShrink: 0,
                }}
              >
                <item.icon size={16} />
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {
        <div
          style={{ padding: "12px 8px 16px", borderTop: "1px solid #e8ecf4" }}
        >
          <NavLink to="/settings" className="sidebar-item" onClick={onClose}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 9,
              }}
            >
              <Settings size={16} />
            </div>
            <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-left"
            style={{
              color: "#dc2626",
              border: "none",
              background: "none",
              width: "100%",
              cursor: "pointer",
              marginTop: 4,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 9,
              }}
            >
              <LogOut size={16} />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
