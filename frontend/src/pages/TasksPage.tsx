import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Priority, TaskItem, TaskPayload } from '../types';

const emptyForm: TaskPayload = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: null,
};

export function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [form, setForm] = useState<TaskPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(async (showLoading = true) => {
    if (!user) {
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError('');
      setTasks(await api.getTasks(user));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (!user) {
        return;
      }

      try {
        const nextTasks = await api.getTasks(user);
        if (!cancelled) {
          setTasks(nextTasks);
          setError('');
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load tasks.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = useMemo(() => ({
    completed: tasks.filter((task) => task.isCompleted).length,
    pending: tasks.filter((task) => !task.isCompleted).length,
  }), [tasks]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!form.title?.trim()) {
      setError('Task title is required.');
      return;
    }

    const payload: TaskPayload = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim(),
      dueDate: form.dueDate || null,
      isCompleted: tasks.find((task) => task.id === editingId)?.isCompleted ?? false,
    };

    try {
      setSaving(true);
      setError('');

      if (editingId) {
        await api.updateTask(editingId, payload, user);
      } else {
        await api.createTask(payload, user);
      }

      resetForm();
      await loadTasks();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save task.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task: TaskItem) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
      isCompleted: task.isCompleted,
    });
    setError('');
  };

  const toggleCompletion = async (task: TaskItem) => {
    if (!user) {
      return;
    }

    try {
      await api.updateTask(
        task.id,
        {
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          isCompleted: !task.isCompleted,
        },
        user,
      );
      await loadTasks();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update task status.');
    }
  };

  const removeTask = async (taskId: number) => {
    if (!user) {
      return;
    }

    try {
      setError('');
      await api.deleteTask(taskId, user);
      if (editingId === taskId) {
        resetForm();
      }
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete task.');
    }
  };

  return (
    <section className="page-section two-column-layout">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">CRUD page</p>
            <h2>{editingId ? 'Edit task' : 'Create a task'}</h2>
          </div>
          {(editingId || form.title || form.description) && (
            <button className="ghost-button" onClick={resetForm} type="button">
              Reset
            </button>
          )}
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description ?? ''}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>

          <div className="inline-fields">
            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({ ...current, priority: event.target.value as Priority }))
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={form.dueDate ?? ''}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dueDate: event.target.value || null }))
                }
              />
            </label>
          </div>

          {error && <p className="error-banner">{error}</p>}

          <button disabled={saving} type="submit">
            {saving ? 'Saving...' : editingId ? 'Update task' : 'Create task'}
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Your tasks</h2>
            <p className="muted">
              {stats.pending} open / {stats.completed} completed
            </p>
          </div>
        </div>

        {loading ? (
          <p className="status-banner">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks available yet.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <div className="task-row">
                  <div>
                    <div className="task-title-row">
                      <strong>{task.title}</strong>
                      <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      {task.isCompleted && <span className="pill complete">Completed</span>}
                    </div>
                    <p>{task.description || 'No description provided.'}</p>
                    <small>
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                    </small>
                  </div>

                  <div className="task-actions">
                    <button className="secondary-button" onClick={() => void toggleCompletion(task)} type="button">
                      {task.isCompleted ? 'Mark open' : 'Complete'}
                    </button>
                    <button className="ghost-button" onClick={() => startEdit(task)} type="button">
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => void removeTask(task.id)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
