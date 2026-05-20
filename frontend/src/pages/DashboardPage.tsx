import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { TaskItem } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');
        setTasks(await api.getTasks(user));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    void loadTasks();
  }, [user]);

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.isCompleted).length;
    const overdue = tasks.filter(
      (task) => !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date(),
    ).length;

    return [
      { label: 'Total tasks', value: total },
      { label: 'Completed', value: completed },
      { label: 'Open', value: total - completed },
      { label: 'Overdue', value: overdue },
    ];
  }, [tasks]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Overview</h2>
          <p className="muted">Track progress across your mock in-memory tasks.</p>
        </div>
      </div>

      {loading ? (
        <p className="status-banner">Loading dashboard...</p>
      ) : error ? (
        <p className="error-banner">{error}</p>
      ) : (
        <>
          <div className="summary-grid">
            {summary.map((item) => (
              <article className="summary-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <section className="panel">
            <div className="panel-header">
              <h3>Upcoming work</h3>
              <span>{tasks.length} task(s)</span>
            </div>
            {tasks.length === 0 ? (
              <p className="muted">No tasks yet. Head to the task manager to create one.</p>
            ) : (
              <ul className="task-list compact">
                {tasks.slice(0, 4).map((task) => (
                  <li key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.description || 'No description provided.'}</p>
                    </div>
                    <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </section>
  );
}
