import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-layout__content" aria-labelledby="auth-title">
        <p className="eyebrow">Store Rating</p>
        <Outlet />
      </section>
    </main>
  );
}

export default AuthLayout;
