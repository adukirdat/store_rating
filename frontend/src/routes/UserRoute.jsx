import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { getRoleHome } from '../utils/roleRoutes.js';

function UserRoute() {
  const { user } = useAuth();
  return user?.role === 'NORMAL_USER' ? <Outlet /> : <Navigate to={getRoleHome(user?.role)} replace />;
}

export default UserRoute;
