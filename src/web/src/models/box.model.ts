import { ProductInBox } from "./product.model";

export interface Box {
  id: string;
  image: string;
  barCode: string;
  name: string;
  discount: number;
  unitPrice: number;
  stock: number;
  weight: number;
  depth: number;
  height: number;
  width: number;
  products: ProductInBox[];
  productCount: number;
  uniqueProductCount: number;
}
