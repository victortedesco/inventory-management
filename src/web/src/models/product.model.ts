import { Box } from "./box.model";
import { Category } from "./category.model";

export interface Product {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  stock: number;
  totalStock: number;
  barCode: string;
  category: Category;
}

export interface ProductWithBoxes {
  product: Product;
  boxes: Box[];
}

export interface ProductInBox {
  boxId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export const formatMoney = (value: number): string => {
  if (!value) return "R$ 0,00"
  return "R$ " + value.toFixed(2).replace(".", ",");
};

export const formatBarCode = (codigo: string): string => {
  if (!/^\d{13}$/.test(codigo)) {
    console.error("O código de barras deve conter exatamente 13 dígitos numéricos.");
    return codigo;
  }

  return `${codigo.slice(0, 1)}|${codigo.slice(1, 7)}|${codigo.slice(7, 13)}`;
}
