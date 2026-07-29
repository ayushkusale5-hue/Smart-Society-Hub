import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Storage seed
import { seedInitialData } from "./services/storage.service.js";

// Guards & Layout
import { AuthGuard, GuestGuard, RoleGuard } from "./components/auth/Guards";
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Landing
import LandingPage from "./pages/LandingPage";

// Dashboards
import ResidentDashboard from "./pages/dashboards/ResidentDashboard";
import CommitteeDashboard from "./pages/dashboards/CommitteeDashboard";
import SecurityDashboard from "./pages/dashboards/SecurityDashboard";
import MaintenanceDashboard from "./pages/dashboards/MaintenanceDashboard";
import VendorDashboard from "./pages/dashboards/VendorDashboard";

// Error pages
import { NotFoundPage, UnauthorizedPage } from "./pages/ErrorPages";

// Modules (Phase 2)
import ComplaintsPage from "./pages/modules/ComplaintsPage";
import ManageComplaintsPage from "./pages/modules/ManageComplaintsPage";

// Auth store
import { useAuthStore } from "./store/authStore";
import { getDashboardRoute } from "./components/auth/Guards";

// Smart redirect based on role
function DashboardRedirect() {
  const { user } = useAuthStore();
  return <Navigate to={getDashboardRoute(user?.role)} replace />;
}

// Placeholder page for future modules
const ComingSoon = ({ label }) => (
  <div className="card p-12 text-center">
    <div className="text-4xl mb-4">🚧</div>
    <h3
      className="text-lg font-bold mb-2"
      style={{ color: "var(--color-text-primary)" }}
    >
      {label}
    </h3>
    <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
      This module is coming in the next phase.
    </p>
  </div>
);

function App() {
  // Seed localStorage with initial data on first load
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />
        <Route
          path="/register"
          element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestGuard>
              <ForgotPasswordPage />
            </GuestGuard>
          }
        />
        <Route
          path="/verify-email"
          element={
            <GuestGuard>
              <VerifyEmailPage />
            </GuestGuard>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestGuard>
              <ResetPasswordPage />
            </GuestGuard>
          }
        />

        {/* Dashboard routes (require auth) */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardRedirect />} />
          <Route
            path="resident"
            element={
              <RoleGuard allowedRoles={["resident"]}>
                <ResidentDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="committee"
            element={
              <RoleGuard allowedRoles={["committee"]}>
                <CommitteeDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="security"
            element={
              <RoleGuard allowedRoles={["security"]}>
                <SecurityDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="maintenance"
            element={
              <RoleGuard allowedRoles={["maintenance"]}>
                <MaintenanceDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="vendor"
            element={
              <RoleGuard allowedRoles={["vendor"]}>
                <VendorDashboard />
              </RoleGuard>
            }
          />
        </Route>

        {/* All module routes under the authenticated dashboard layout */}
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route
            path="/visitors"
            element={<ComingSoon label="Visitor Management — Phase 2" />}
          />
          <Route
            path="/complaints"
            element={<ComplaintsPage />}
          />
          <Route
            path="/billing"
            element={<ComingSoon label="Maintenance Billing — Phase 2" />}
          />
          <Route
            path="/parking"
            element={<ComingSoon label="Parking Management — Phase 3" />}
          />
          <Route
            path="/notices"
            element={<ComingSoon label="Notice Board — Phase 3" />}
          />
          <Route
            path="/polls"
            element={<ComingSoon label="Polls & Voting — Phase 3" />}
          />
          <Route
            path="/events"
            element={<ComingSoon label="Events — Phase 3" />}
          />
          <Route
            path="/facilities"
            element={<ComingSoon label="Facility Booking — Phase 3" />}
          />
          <Route
            path="/marketplace"
            element={<ComingSoon label="Community Marketplace — Phase 3" />}
          />
          <Route
            path="/lost-found"
            element={<ComingSoon label="Lost & Found — Phase 3" />}
          />
          <Route
            path="/chat"
            element={<ComingSoon label="Community Chat — Phase 2" />}
          />
          <Route
            path="/sos"
            element={<ComingSoon label="Emergency SOS — Phase 4" />}
          />
          <Route
            path="/analytics"
            element={<ComingSoon label="Analytics Dashboard — Phase 4" />}
          />
          <Route
            path="/settings"
            element={<ComingSoon label="Settings — Phase 2" />}
          />
          {/* Committee */}
          <Route
            path="/visitors/all"
            element={<ComingSoon label="All Visitors — Phase 2" />}
          />
          <Route
            path="/residents"
            element={<ComingSoon label="Residents Management — Phase 2" />}
          />
          <Route
            path="/complaints/manage"
            element={<ManageComplaintsPage />}
          />
          <Route
            path="/billing/manage"
            element={<ComingSoon label="Billing Management — Phase 2" />}
          />
          <Route
            path="/notices/manage"
            element={<ComingSoon label="Manage Notices — Phase 3" />}
          />
          <Route
            path="/polls/manage"
            element={<ComingSoon label="Manage Polls — Phase 3" />}
          />
          <Route
            path="/events/manage"
            element={<ComingSoon label="Manage Events — Phase 3" />}
          />
          <Route
            path="/facilities/manage"
            element={<ComingSoon label="Manage Facilities — Phase 3" />}
          />
          <Route
            path="/parking/manage"
            element={<ComingSoon label="Manage Parking — Phase 3" />}
          />
          <Route
            path="/vendors"
            element={<ComingSoon label="Vendors — Phase 3" />}
          />
          {/* Security */}
          <Route
            path="/visitors/gate"
            element={<ComingSoon label="Visitor Gate — Phase 2" />}
          />
          <Route
            path="/visitors/expected"
            element={<ComingSoon label="Expected Visitors — Phase 2" />}
          />
          <Route
            path="/incidents"
            element={<ComingSoon label="Incident Reports — Phase 4" />}
          />
          <Route
            path="/vehicles"
            element={<ComingSoon label="Vehicle Logs — Phase 4" />}
          />
          {/* Maintenance */}
          <Route
            path="/tasks"
            element={<ComingSoon label="My Tasks — Phase 2" />}
          />
          <Route
            path="/tasks/history"
            element={<ComingSoon label="Task History — Phase 2" />}
          />
          <Route
            path="/complaints/assigned"
            element={<ManageComplaintsPage />}
          />
          {/* Vendor */}
          <Route
            path="/service-requests"
            element={<ComingSoon label="Service Requests — Phase 2" />}
          />
          <Route
            path="/jobs"
            element={<ComingSoon label="My Jobs — Phase 2" />}
          />
          <Route
            path="/bills"
            element={<ComingSoon label="Upload Bills — Phase 2" />}
          />
        </Route>

        {/* Error pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          },
          success: { iconTheme: { primary: "#16a34a", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#ffffff" } },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
