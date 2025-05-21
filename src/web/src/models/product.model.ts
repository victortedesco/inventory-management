import Category from "./category.model";

export default interface Product {
  id: string;
  name: string;
  image: File | string;
  unitPrice: number;
  quantity: number;
  category: Category;
}
