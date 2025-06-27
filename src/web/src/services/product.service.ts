import { Product, ProductWithBoxes} from "@/models/product.model";
import { CreateProductRequest } from "@/requests/product-request.interfaces";

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

export const getAllProductsByCategoryId: (
  categoryId: string,
  skip?: number,
  take?: number,
) => Promise<Product[]> = async (categoryId) => {
  const response = await fetch(`${PRODUCT_API_URL}/category/${categoryId}`, {
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
  const data = await response.json()
  return data.product as Product;
};

export const getProductWithBoxesById: (id: string) => Promise<ProductWithBoxes | null> = async (id) => {
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
  const data = await response.json()
  return data as ProductWithBoxes;
}

export const createProduct: (request: CreateProductRequest) => Promise<Product | null> = async (request) => {
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

export const updateProduct: (id: string, request: CreateProductRequest) => Promise<Product | null> = async (id, request) => {
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

export const deleteProduct: (id: string) => Promise<boolean> = async(id) => {
  const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 404 || response.status === 400) {
    console.error("Error deleting product:", response.statusText);
    return false;
  }
  return true;
}

export const updateProductStock = async (productId: string, newStock: number) => {
  const response = await fetch(`${PRODUCT_API_URL}/${productId}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(newStock),
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar estoque: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

