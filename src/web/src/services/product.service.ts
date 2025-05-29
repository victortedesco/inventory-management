import Product from "@/models/product.model";
import { CreateProductRequest } from "@/requests/add-product-request";

const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL + "/api/v1/products";

export const getAllProducts: (
  skip?: number,
  take?: number
) => Promise<Product[]> = async () => {
  const response = await fetch(`${PRODUCT_API_URL}`, {
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
  return data as Product[];
};

export const getProductById: (id: string) => Promise<Product | null> = async (id) => {
  const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
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
  return data as Product;
};

export const postProduct: (request: CreateProductRequest) => Promise<Product | null> = async (request) => {
  const response = await fetch(`${PRODUCT_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error creating product:", response.text());
    return null;
  }
  const data = await response.json();
  return data as Product;
}

export const putProduct: (id: string, request: CreateProductRequest) => Promise<Product | null> = async (id, request) => {
  const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(request)
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error updating product:", response.text());
    return null;
  }
  const data = await response.json();
  return data as Product;
}
