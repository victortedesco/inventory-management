import Category from "./category.model";

export default interface Product {
  id: string;
  name: string;
  image: File | string;
  unitPrice: number;
  quantity: number;
  category: Category;
}

export const formatMoney = (value: number) => {
  return "R$ " + value.toFixed(2).toString().replace(".", ",");
};
