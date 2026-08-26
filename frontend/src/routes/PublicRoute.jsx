import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleRoutes.js';
import LoadingState from '../components/common/LoadingState.jsx';

function PublicRoute() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingState label="Restoring your session…" />;
  }

  return isAuthenticated ? <Navigate to={getRoleHome(user.role)} replace /> : <Outlet />;
}

export default PublicRoute;
