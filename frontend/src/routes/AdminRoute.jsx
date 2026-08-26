import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleRoutes.js';

function AdminRoute() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to={getRoleHome(user?.role)} replace />;
}

export default AdminRoute;
