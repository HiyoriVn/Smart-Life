import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AppProvider } from './AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Kanban } from './pages/Kanban';
import { Analytics } from './pages/Analytics';
import { Schedule } from './pages/Schedule';
import { AutoScheduler } from './pages/AutoScheduler';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* App Routes */}
            <Route element={<Layout />}>
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
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}
