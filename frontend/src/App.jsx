import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage.jsx';
import PlaceholderPage from './pages/common/PlaceholderPage.jsx';
import RoleEntryPage from './pages/common/RoleEntryPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<RoleEntryPage />} />
            <Route path="/app/update-password" element={<UpdatePasswordPage />} />
            <Route path="/admin" element={<PlaceholderPage title="Admin workspace" description="Admin interface will be added in a later phase." />} />
            <Route path="/user" element={<PlaceholderPage title="Store workspace" description="Store browsing interface will be added in a later phase." />} />
            <Route path="/owner" element={<PlaceholderPage title="Owner workspace" description="Store Owner interface will be added in a later phase." />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
