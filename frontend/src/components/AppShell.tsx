import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AppShell() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Mock Authentication</p>
          <h1>Task Manager</h1>
          <p className="muted">Signed in as {user?.name}</p>
          <p className="muted">{user?.email}</p>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/tasks">Task Manager</NavLink>
        </nav>

        <button
          className="secondary-button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign out
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
