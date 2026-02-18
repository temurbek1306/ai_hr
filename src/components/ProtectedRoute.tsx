import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    if (!isAuthenticated) {
        // Not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Logged in but not admin, redirect to user dashboard
        return <Navigate to="/user/dashboard" replace />;
    }

    if (!requireAdmin && isAdmin) {
        // Admin trying to access user routes, redirect to admin dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <>{children}</>;
}
