import type { AuthRequest, TaskItem, TaskPayload, UserSession } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5152/api';

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, user?: UserSession): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (user?.email) {
    headers.set('X-User-Email', user.email);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : null;

  if (!response.ok) {
    throw new ApiError((data?.message as string) ?? 'Request failed.', response.status);
  }

  return data as T;
}

export const api = {
  login: (payload: AuthRequest) =>
    request<UserSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  register: (payload: AuthRequest) =>
    request<UserSession>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTasks: (user: UserSession) => request<TaskItem[]>('/tasks', {}, user),
  createTask: (payload: TaskPayload, user: UserSession) =>
    request<TaskItem>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, user),
  updateTask: (id: number, payload: TaskPayload, user: UserSession) =>
    request<TaskItem>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, user),
  deleteTask: (id: number, user: UserSession) =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }, user),
};

export { ApiError };
