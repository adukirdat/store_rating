import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { getRoleHome } from '../../utils/roleRoutes.js';

function RoleEntryPage() {
  const { user } = useAuth();
  return <Navigate to={getRoleHome(user?.role)} replace />;
}

export default RoleEntryPage;
