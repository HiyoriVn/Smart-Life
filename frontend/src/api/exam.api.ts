import api from "./axios";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ExamPayload {
  title: string;
  duration: number; // minutes
  type: string;
  exam_date: string; // ISO date
  course_id?: string | null;
  user_id: string;
}

export interface ExamResponse {
  id: string;
  title: string;
  duration: number;
  type: string;
  exam_date: string;
  course_id: string | null;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  API functions — exam controller returns RAW objects (no wrapper)    */
/* ------------------------------------------------------------------ */

export const getExams = async (): Promise<ExamResponse[]> => {
  const { data } = await api.get<ExamResponse[]>("/exams");
  return data;
};

export const getExamById = async (id: string): Promise<ExamResponse> => {
  const { data } = await api.get<ExamResponse>(`/exams/${id}`);
  return data;
};

export const createExam = async (
  payload: ExamPayload,
): Promise<ExamResponse> => {
  const { data } = await api.post<ExamResponse>("/exams", payload);
  return data;
};

export const updateExam = async (
  id: string,
  payload: Partial<ExamPayload>,
): Promise<ExamResponse> => {
  const { data } = await api.put<ExamResponse>(`/exams/${id}`, payload);
  return data;
};

export const deleteExam = async (id: string): Promise<void> => {
  await api.delete(`/exams/${id}`);
};
