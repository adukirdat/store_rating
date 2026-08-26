import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';

function AdminLayout() {
  const { user, logout } = useAuth();
  return <div className="admin-layout">
    <header className="admin-header"><PageContainer className="admin-header__content">
      <div><p className="app-header__brand">Store Rating</p><p className="app-header__user">Admin · {user?.name}</p></div>
      <nav className="admin-nav" aria-label="Admin navigation">
        <NavLink to="/admin" end>Dashboard</NavLink><NavLink to="/admin/users">Users</NavLink><NavLink to="/admin/stores">Stores</NavLink>
      </nav>
      <Button variant="secondary" onClick={logout}>Sign out</Button>
    </PageContainer></header>
    <main><Outlet /></main>
  </div>;
}

export default AdminLayout;
