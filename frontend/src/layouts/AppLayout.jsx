import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/common/Button.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';

function AppLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <PageContainer className="app-header__content">
          <div>
            <p className="app-header__brand">Store Rating</p>
            <p className="app-header__user">{user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>Sign out</Button>
        </PageContainer>
      </header>
      <main><Outlet /></main>
    </div>
  );
}

export default AppLayout;
