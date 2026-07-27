import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Redirect to login if not authenticated
export function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Redirect to dashboard if already authenticated
export function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return children;
}

// Only allow specific roles
export function RoleGuard({ children, allowedRoles }) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function getDashboardRoute(role) {
  const routes = {
    resident: '/dashboard/resident',
    committee: '/dashboard/committee',
    security: '/dashboard/security',
    maintenance: '/dashboard/maintenance',
    vendor: '/dashboard/vendor',
  };
  return routes[role] || '/dashboard/resident';
}
