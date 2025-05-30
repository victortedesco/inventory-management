import User from "@/models/user.model";
import { CreateUserRequest, UpdateUserRequest } from "@/requests/user-request.interfaces";

const USER_API_URL = import.meta.env.VITE_USERS_API_URL + "/api/v1/users";

export const getAllUsers: () => Promise<User[]> = async () => {
  const response = await fetch(`${USER_API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 204) {
    return [];
  }
  const data = await response.json();
  return data as User[];
};

export const getUserById: (id: string) => Promise<User | null> = async (id) => {
  const response = await fetch(`${USER_API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 404) {
    return null;
  }
  const data = await response.json();
  return data as User;
};

export const getRoles: () => Promise<string[]> = async () => {
  const response = await fetch(`${USER_API_URL}/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data as string[];
}

export const getRolesWhoCanEdit: () => Promise<string[]> = async () => {
  const response = await fetch(`${USER_API_URL}/edit`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data as string[];
}

export const createUser: (user: CreateUserRequest) => Promise<User | null> = async (user) => {
  const response = await fetch(`${USER_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error creating user:", response.statusText);
    return null;
  }
  const data = await response.json();
  return data as User;
}

export const updateUser: (id: string, user: UpdateUserRequest) => Promise<User | null> = async (id, user) => {
  const response = await fetch(`${USER_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error updating user:", response.statusText);
    return null;
  }
  const data = await response.json();
  return data as User;
}
