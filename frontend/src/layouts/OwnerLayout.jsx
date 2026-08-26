import { Link, NavLink, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';

function OwnerLayout() {
  const { user, logout } = useAuth();
  return <div className="owner-layout"><header className="owner-header"><PageContainer className="owner-header__content"><div><p className="app-header__brand">Store Rating</p><p className="app-header__user">{user?.name}</p></div><nav className="owner-nav" aria-label="Owner navigation"><NavLink to="/owner" end>Dashboard</NavLink><Link to="/app/update-password">Update password</Link></nav><Button variant="secondary" onClick={logout}>Sign out</Button></PageContainer></header><main><Outlet /></main></div>;
}

export default OwnerLayout;
