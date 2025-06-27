import Category from "@/models/category.model";
import { CreateCategoryRequest } from "@/requests/category-request.interfaces";

const CATEGORY_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL + "/api/v1/categories";

export const getAllCategories: (
  name?: string,
  skip?: number,
  take?: number
) => Promise<Category[]> = async (name, skip, take) => {
  const urlParams = new URLSearchParams();
  if (name) {
    urlParams.append("Name", name);
  }
  if (skip) {
    urlParams.append("Skip", skip.toString());
  }
  if (take) {
    urlParams.append("Take", take.toString());
  }
  
  const url = `${CATEGORY_API_URL}?${urlParams.toString()}`;

  const response = await fetch(`${url}`, {
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

export const getCategoryById: (id: string) => Promise<Category | null> = async (id) => {
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

export const updateCategory: (id: string, request: CreateCategoryRequest) => Promise<Category | null> = async (id, request) => {
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

export const deleteCategory: (id: string) => Promise<boolean> = async(id) => {
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`, // Descomente se precisar de autenticação
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar: ${response.statusText}`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  return await response.json();
}

export const getCategoriesByTotalStock: (smallestValue: number, largestValue: number) => Promise<Category[]> = async(smallestValue, largestValue) =>{
  if (smallestValue < 0 || largestValue < 0) {
    throw new Error("Values must be non-negative");
  }
  if (smallestValue > largestValue) {
    throw new Error("Smallest value cannot be greater than largest value");
  }
  if (isNaN(smallestValue) || isNaN(largestValue)) {
    throw new Error("Values must be valid numbers");
  }
  return fetchJson<Category[]>(`${CATEGORY_API_URL}/totalStock?SmallestValue=${smallestValue}&LargestValue=${largestValue}`)
}

export const getCategoriesByValue: (smallestValue: number, largestValue: number) => Promise<Category[]> = async(smallestValue, largestValue) =>{
  if (smallestValue < 0 || largestValue < 0) {
    throw new Error("Values must be non-negative");
  }
  if (smallestValue > largestValue) {
    throw new Error("Smallest value cannot be greater than largest value");
  }
  if (isNaN(smallestValue) || isNaN(largestValue)) {
    throw new Error("Values must be valid numbers");
  }
  return fetchJson<Category[]>(`${CATEGORY_API_URL}/value?SmallestValue=${smallestValue}&LargestValue=${largestValue}`)
}

