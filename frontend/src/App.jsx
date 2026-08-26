import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminStoresPage from './pages/admin/AdminStoresPage.jsx';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import PlaceholderPage from './pages/common/PlaceholderPage.jsx';
import RoleEntryPage from './pages/common/RoleEntryPage.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import UserRoute from './routes/UserRoute.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import UserStoresPage from './pages/user/UserStoresPage.jsx';
import OwnerRoute from './routes/OwnerRoute.jsx';
import OwnerLayout from './layouts/OwnerLayout.jsx';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage.jsx';
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
          </Route>
          <Route element={<UserRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/user" element={<UserStoresPage />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/:userId" element={<AdminUserDetailsPage />} />
              <Route path="/admin/stores" element={<AdminStoresPage />} />
            </Route>
          </Route>
          <Route element={<OwnerRoute />}>
            <Route element={<OwnerLayout />}>
              <Route path="/owner" element={<OwnerDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
