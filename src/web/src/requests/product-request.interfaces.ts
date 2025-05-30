export interface CreateProductRequest {
  name: string;
  image: string;
  barcode: string
  categoryId: string
  unitPrice: number
  quantity: number
}

export interface UpdateProductRequest {
  id: string;
  name: string;
  image: string;
  barcode: string
  categoryId: string
  unitPrice: number
  quantity: number
}
