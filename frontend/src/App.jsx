import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
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
            <Route path="/login" element={<PlaceholderPage title="Sign in" description="Authentication UI will be added in the next phase." />} />
            <Route path="/signup" element={<PlaceholderPage title="Create an account" description="Registration UI will be added in the next phase." />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<RoleEntryPage />} />
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
