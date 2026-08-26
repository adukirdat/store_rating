import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleRoutes.js';

function OwnerRoute() {
  const { user } = useAuth();
  return user?.role === 'STORE_OWNER' ? <Outlet /> : <Navigate to={getRoleHome(user?.role)} replace />;
}

export default OwnerRoute;
