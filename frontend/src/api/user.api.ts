import api from "./axios";

export interface UserPayload {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const { data } = await api.get<UserResponse[]>("/users");
  return data;
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const { data } = await api.get<UserResponse>(`/users/${id}`);
  return data;
};

export const createUser = async (
  payload: UserPayload,
): Promise<UserResponse> => {
  const { data } = await api.post<UserResponse>("/users", payload);
  return data;
};

export const updateUser = async (
  id: string,
  payload: Partial<UserPayload>,
): Promise<UserResponse> => {
  const { data } = await api.put<UserResponse>(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
