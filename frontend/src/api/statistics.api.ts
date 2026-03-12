import api from "./axios";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatisticsPayload {
  total_tasks: number;
  completed_tasks: number;
  study_time: number; // minutes
  user_id: string;
}

export interface StatisticsResponse {
  id: string;
  total_tasks: number;
  completed_tasks: number;
  study_time: number;
  user_id: string;
}

/* ------------------------------------------------------------------ */
/*  API functions — statistics controller returns RAW objects           */
/* ------------------------------------------------------------------ */

export const getStatisticsByUser = async (
  userId: string,
): Promise<StatisticsResponse | null> => {
  try {
    const { data } = await api.get<StatisticsResponse>(`/statistics/${userId}`);
    return data;
  } catch {
    // 404 means no statistics row yet — that's OK
    return null;
  }
};

export const createStatistics = async (
  payload: StatisticsPayload,
): Promise<StatisticsResponse> => {
  const { data } = await api.post<StatisticsResponse>("/statistics", payload);
  return data;
};

export const updateStatistics = async (
  id: string,
  payload: Omit<StatisticsPayload, "user_id">,
): Promise<StatisticsResponse> => {
  const { data } = await api.put<StatisticsResponse>(
    `/statistics/${id}`,
    payload,
  );
  return data;
};

export const deleteStatistics = async (id: string): Promise<void> => {
  await api.delete(`/statistics/${id}`);
};
