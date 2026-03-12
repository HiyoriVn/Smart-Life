import api from "./axios";
import type { Task, TaskStatus, Priority, Category } from "../types";

/* ------------------------------------------------------------------ */
/*  Backend ↔ Frontend type mapping                                    */
/* ------------------------------------------------------------------ */

/** Shape returned by the backend */
interface BackendTask {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  priority: string;
  status: string;
  course_id: string | null;
  user_id: string;
  created_at: string;
}

/** Extra frontend fields packed into backend `description` as JSON */
interface TaskMeta {
  category?: string;
  duration?: number;
  order?: number;
  note?: string;
}

function packMeta(meta: TaskMeta): string {
  return JSON.stringify(meta);
}

function unpackMeta(description: string | null): TaskMeta {
  if (!description) return {};
  try {
    return JSON.parse(description);
  } catch {
    // Legacy plain-text description
    return { note: description };
  }
}

/** Convert a backend task to the frontend Task shape */
function toFrontendTask(bt: BackendTask): Task {
  const meta = unpackMeta(bt.description);
  return {
    id: bt.id,
    name: bt.title,
    status: (bt.status as TaskStatus) || "todo",
    priority: (bt.priority as Priority) || "medium",
    category: (meta.category as Category) || "study",
    deadline: bt.deadline,
    duration: meta.duration ?? 60,
    note: meta.note ?? "",
    order: meta.order ?? 0,
  };
}

/* ------------------------------------------------------------------ */
/*  DTOs                                                               */
/* ------------------------------------------------------------------ */

export interface CreateTaskDTO {
  name: string;
  status: TaskStatus;
  priority: Priority;
  category: Category;
  deadline: string;
  duration: number;
  note: string;
  order: number;
  user_id: string;
  course_id?: string | null;
}

export type UpdateTaskDTO = Omit<Task, "id">;

/* ------------------------------------------------------------------ */
/*  Wrapped backend response                                           */
/* ------------------------------------------------------------------ */

interface ApiResponse<T> {
  message: string;
  data: T;
}

/* ------------------------------------------------------------------ */
/*  Public API functions                                               */
/* ------------------------------------------------------------------ */

export const getTasks = async (status?: string): Promise<Task[]> => {
  const params = status ? { status } : {};
  const { data } = await api.get<ApiResponse<BackendTask[]>>("/tasks", {
    params,
  });
  return (data.data || []).map(toFrontendTask);
};

export const getTaskById = async (id: string): Promise<Task> => {
  const { data } = await api.get<ApiResponse<BackendTask>>(`/tasks/${id}`);
  return toFrontendTask(data.data);
};

export const createTask = async (payload: CreateTaskDTO): Promise<Task> => {
  const backendPayload = {
    title: payload.name,
    description: packMeta({
      category: payload.category,
      duration: payload.duration,
      order: payload.order,
      note: payload.note,
    }),
    deadline: payload.deadline,
    priority: payload.priority,
    status: payload.status,
    user_id: payload.user_id,
    course_id: payload.course_id ?? null,
  };
  const { data } = await api.post<ApiResponse<BackendTask>>(
    "/tasks",
    backendPayload,
  );
  return toFrontendTask(data.data);
};

export const updateTask = async (
  id: string,
  task: UpdateTaskDTO,
): Promise<Task> => {
  const backendPayload = {
    title: task.name,
    description: packMeta({
      category: task.category,
      duration: task.duration,
      order: task.order,
      note: task.note,
    }),
    deadline: task.deadline,
    priority: task.priority,
    status: task.status,
  };
  const { data } = await api.put<ApiResponse<BackendTask>>(
    `/tasks/${id}`,
    backendPayload,
  );
  return toFrontendTask(data.data);
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus,
): Promise<Task> => {
  const { data } = await api.put<ApiResponse<BackendTask>>(
    `/tasks/${id}/status`,
    { status },
  );
  return toFrontendTask(data.data);
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
