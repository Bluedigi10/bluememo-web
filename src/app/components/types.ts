export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
}
