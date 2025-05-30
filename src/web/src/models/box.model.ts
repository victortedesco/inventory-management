import Product from "./product.model";

export default interface Box {
  id: string;
  name: string;
  discount: number;
  unitPrice: number;
  quantity: number;
  weight: number;
  depth: number;
  height: number;
  width: number;
  products: Product[];
}
