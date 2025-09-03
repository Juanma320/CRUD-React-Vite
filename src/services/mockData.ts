export type User = {
  id: number;
  name: string;
  email: string;
};

export let mockUsers: User[] = [
  { id: 1, name: "Juan", email: "juan@example.com" },
  { id: 2, name: "María", email: "maria@example.com" },
  { id: 3, name: "Pedro", email: "pedro@example.com" },
];

// Funciones CRUD simuladas
export const getUsers = () => Promise.resolve(mockUsers);

export const getUserById = (id: number) =>
  Promise.resolve(mockUsers.find((u) => u.id === id));

export const createUser = (user: Omit<User, "id">) => {
  const newUser = { id: Date.now(), ...user };
  mockUsers.push(newUser);
  return Promise.resolve(newUser);
};

export const updateUser = (id: number, updated: Omit<User, "id">) => {
  mockUsers = mockUsers.map((u) => (u.id === id ? { id, ...updated } : u));
  return Promise.resolve(true);
};

export const deleteUser = (id: number) => {
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return Promise.resolve(true);
};
