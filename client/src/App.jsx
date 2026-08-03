import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";


import { seedInitialData } from "./services/storage.service.js";


import { AuthGuard, GuestGuard, RoleGuard } from "./components/auth/Guards";
import DashboardLayout from "./components/layout/DashboardLayout";


import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";


import LandingPage from "./pages/LandingPage";


import ResidentDashboard from "./pages/dashboards/ResidentDashboard";
import CommitteeDashboard from "./pages/dashboards/CommitteeDashboard";
import SecurityDashboard from "./pages/dashboards/SecurityDashboard";
import MaintenanceDashboard from "./pages/dashboards/MaintenanceDashboard";
import VendorDashboard from "./pages/dashboards/VendorDashboard";


import { NotFoundPage, UnauthorizedPage } from "./pages/ErrorPages";


import ComplaintsPage from "./pages/modules/ComplaintsPage";
import ManageComplaintsPage from "./pages/modules/ManageComplaintsPage";
import VisitorPage from "./pages/modules/VisitorPage";
import VisitorGatePage from "./pages/modules/VisitorGatePage";
import AllVisitorsPage from "./pages/modules/AllVisitorsPage";
import NoticeBoardPage from "./pages/modules/NoticeBoardPage";
import ManageNoticesPage from "./pages/modules/ManageNoticesPage";
import ResidentsPage from "./pages/modules/ResidentsPage";
import SettingsPage from "./pages/modules/SettingsPage";
import BillingPage from './pages/modules/BillingPage';
import ManageBillingPage from './pages/modules/ManageBillingPage';
import PollsPage from './pages/modules/PollsPage';
import ManagePollsPage from './pages/modules/ManagePollsPage';
import FacilitiesPage from './pages/modules/FacilitiesPage';
import ManageFacilitiesPage from './pages/modules/ManageFacilitiesPage';
import ParkingPage from './pages/modules/ParkingPage';
import ManageParkingPage from './pages/modules/ManageParkingPage';
import MarketplacePage from './pages/modules/MarketplacePage';


import { useAuthStore } from "./store/authStore";
import { getDashboardRoute } from "./components/auth/Guards";


function DashboardRedirect() {
  const { user } = useAuthStore();
  return <Navigate to={getDashboardRoute(user?.role)} replace />;
}


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
  
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
        <Route path="/" element={<LandingPage />} />

        {
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

        {
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

        {
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route
            path="/visitors"
            element={<VisitorPage />}
          />
          <Route
            path="/complaints"
            element={<ComplaintsPage />}
          />
          <Route
            path="/billing"
            element={<BillingPage />}
          />
          <Route
            path="/parking"
            element={<ParkingPage />}
          />
          <Route
            path="/notices"
            element={<NoticeBoardPage />}
          />
          <Route
            path="/polls"
            element={<PollsPage />}
          />
          <Route
            path="/events"
            element={<ComingSoon label="Events — Phase 3" />}
          />
          <Route
            path="/facilities"
            element={<FacilitiesPage />}
          />
          <Route
            path="/marketplace"
            element={<MarketplacePage />}
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
            element={<SettingsPage />}
          />
          {
          <Route
            path="/visitors/all"
            element={<AllVisitorsPage />}
          />
          <Route
            path="/residents"
            element={<ResidentsPage />}
          />
          <Route
            path="/complaints/manage"
            element={<ManageComplaintsPage />}
          />
          <Route
            path="/billing/manage"
            element={<ManageBillingPage />}
          />
          <Route
            path="/notices/manage"
            element={<ManageNoticesPage />}
          />
          <Route
            path="/polls/manage"
            element={<ManagePollsPage />}
          />
          <Route
            path="/events/manage"
            element={<ComingSoon label="Manage Events — Phase 3" />}
          />
          <Route
            path="/facilities/manage"
            element={<ManageFacilitiesPage />}
          />
          <Route
            path="/parking/manage"
            element={<ManageParkingPage />}
          />
          <Route
            path="/vendors"
            element={<ComingSoon label="Vendors — Phase 3" />}
          />
          {
          <Route
            path="/visitors/gate"
            element={<VisitorGatePage />}
          />
          <Route
            path="/visitors/expected"
            element={<VisitorGatePage />}
          />
          <Route
            path="/incidents"
            element={<ComingSoon label="Incident Reports — Phase 4" />}
          />
          <Route
            path="/vehicles"
            element={<ComingSoon label="Vehicle Logs — Phase 4" />}
          />
          {
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
          {
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

        {
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {
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
