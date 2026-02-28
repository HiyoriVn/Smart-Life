import api from "./axios";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CoursePayload {
  name: string;
  description?: string;
  user_id: string;
}

export interface CourseResponse {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

/* ------------------------------------------------------------------ */
/*  API functions                                                      */
/* ------------------------------------------------------------------ */

export const getCourses = async (): Promise<CourseResponse[]> => {
  const { data } = await api.get<ApiResponse<CourseResponse[]>>("/courses");
  return data.data;
};

export const getCourseById = async (id: string): Promise<CourseResponse> => {
  const { data } = await api.get<ApiResponse<CourseResponse>>(`/courses/${id}`);
  return data.data;
};

export const createCourse = async (
  payload: CoursePayload,
): Promise<CourseResponse> => {
  const { data } = await api.post<ApiResponse<CourseResponse>>(
    "/courses",
    payload,
  );
  return data.data;
};

export const updateCourse = async (
  id: string,
  payload: Partial<Omit<CoursePayload, "user_id">>,
): Promise<CourseResponse> => {
  const { data } = await api.put<ApiResponse<CourseResponse>>(
    `/courses/${id}`,
    payload,
  );
  return data.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/courses/${id}`);
};
