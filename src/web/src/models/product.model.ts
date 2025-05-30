import Category from "./category.model";

export default interface Product {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  barcode: string;
  category: Category;
}

export const formatMoney = (value: number) => {
  return "R$ " + value.toFixed(2).replace(".", ",");
};
