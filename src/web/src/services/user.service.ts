import User from "@/models/user.model";

const USER_API_URL = import.meta.env.VITE_USERS_API_URL + "/api/v1/users";

export const getAll: () => Promise<User[]> = async () => {
  const response = await fetch(`${USER_API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data as User[];
};

export const getById: (id: string) => Promise<User> = async (id) => {
  const response = await fetch(`${USER_API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data as User;
};
