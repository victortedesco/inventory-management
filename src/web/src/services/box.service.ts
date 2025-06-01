import Box from "@/models/box.model";
import { CreateProductRequest } from "@/requests/product-request.interfaces";

const BOX_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL + "/api/v1/boxes";

export const getAllBoxes: (
  skip?: number,
  take?: number
) => Promise<Box[]> = async () => {
  const response = await fetch(`${BOX_API_URL}`, {
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
  return data as Box[];
};

export const getBoxById: (id: string) => Promise<Box | null> = async (id) => {
  const response = await fetch(`${BOX_API_URL}/${id}`, {
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
  return data as Box;
};

export const createBox: (request: CreateProductRequest) => Promise<Box | null> = async (request) => {
  const response = await fetch(`${BOX_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error creating box:", response.text());
    return null;
  }
  const data = await response.json();
  return data as Box;
}

export const updateBox: (id: string, request: CreateProductRequest) => Promise<Box | null> = async (id, request) => {
  const response = await fetch(`${BOX_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error updating box:", response.text());
    return null;
  }
  const data = await response.json();
  return data as Box;
}

export const deleteBox: (id: string) => Promise<boolean> = async(id) => {
  const response = await fetch(`${BOX_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error deleting box:", response.statusText);
    return false;
  }
  return true;
}
