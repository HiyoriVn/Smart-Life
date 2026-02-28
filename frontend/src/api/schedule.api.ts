import api from "./axios";

export interface SchedulePayload {
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  user_id: string;
}

export interface ScheduleResponse {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string | null;
  is_auto: boolean;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getSchedules = async (): Promise<ScheduleResponse[]> => {
  const { data } = await api.get<ApiResponse<ScheduleResponse[]>>("/schedules");
  return data.data;
};

export const getScheduleById = async (
  id: string,
): Promise<ScheduleResponse> => {
  const { data } = await api.get<ApiResponse<ScheduleResponse>>(
    `/schedules/${id}`,
  );
  return data.data;
};

export const createSchedule = async (
  payload: SchedulePayload,
): Promise<ScheduleResponse> => {
  const { data } = await api.post<ApiResponse<ScheduleResponse>>(
    "/schedules",
    payload,
  );
  return data.data;
};

export const updateSchedule = async (
  id: string,
  payload: Partial<Omit<SchedulePayload, "user_id">>,
): Promise<ScheduleResponse> => {
  const { data } = await api.put<ApiResponse<ScheduleResponse>>(
    `/schedules/${id}`,
    payload,
  );
  return data.data;
};

export const deleteSchedule = async (id: string): Promise<void> => {
  await api.delete(`/schedules/${id}`);
};
