import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TasksPage } from './pages/TasksPage';
import { useAuth } from './context/AuthContext';

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate replace to={isAuthenticated ? '/dashboard' : '/login'} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<HomeRedirect />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<TasksPage />} path="/tasks" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
