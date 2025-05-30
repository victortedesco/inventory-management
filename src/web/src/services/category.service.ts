import Category from "@/models/category.model";
import { CreateCategoryRequest } from "@/requests/category-request.interfaces";

const CATEGORY_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL + "/api/v1/categories";

export const getAllCategories: (
  skip?: number,
  take?: number
) => Promise<Category[]> = async () => {
  const response = await fetch(`${CATEGORY_API_URL}`, {
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
  return data as Category[];
};

export const getCategoryById: (id: number) => Promise<Category | null> = async (id) => {
  const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
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
  return data as Category;
};

export const createCategory: (request: CreateCategoryRequest) => Promise<Category | null> = async (request) => {
  const response = await fetch(`${CATEGORY_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error creating category:", response.statusText);
    return null;
  }
  const data = await response.json();
  return data as Category;
}

export const updateCategory: (id: number, request: CreateCategoryRequest) => Promise<Category | null> = async (id, request) => {
  const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error updating category:", response.statusText);
    return null;
  }
  const data = await response.json();
  return data as Category;
} 

export const deleteCategory: (id: number) => Promise<boolean> = async(id) => {
  const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error deleting category:", response.statusText);
    return false;
  }
  return true;
}
