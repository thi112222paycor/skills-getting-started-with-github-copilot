export type Priority = 'Low' | 'Medium' | 'High';

export interface UserSession {
  token: string;
  name: string;
  email: string;
}

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
  isCompleted?: boolean;
}
