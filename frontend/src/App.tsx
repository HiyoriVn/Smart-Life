import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AppProvider, useApp } from './AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Kanban } from './pages/Kanban';
import { Analytics } from './pages/Analytics';
import { Schedule } from './pages/Schedule';
import { AutoScheduler } from './pages/AutoScheduler';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ReactNode, useEffect } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state, toast } = useApp();
  const location = useLocation();
  const session = state.session;
  const isExpired = !session || new Date(session.expiresAt) < new Date();

  if (isExpired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const session = state.session;
  const isExpired = !session || new Date(session.expiresAt) < new Date();

  if (!isExpired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* App Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/auto-scheduler" element={<AutoScheduler />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}
