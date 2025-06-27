export interface CreateProductRequest {
  name: string;
  image: string;
  barCode: string
  categoryId: string
  unitPrice: number
  stock: number
}

export interface UpdateProductRequest {
  id: string;
  name: string;
  image: string;
  barCode: string
  categoryId: string
  unitPrice: number
  stock: number
}
