import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Tipado
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserData {
  name: string;
  email: string;
}

// Funciones CRUD usando la instancia api
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (user: CreateUserData): Promise<User> => {
  const res = await api.post("/users", user);
  return res.data;
};

export const updateUser = async (id: number, user: CreateUserData): Promise<User> => {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export default api;