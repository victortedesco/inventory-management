import Category from "./category.model";

export default interface Product {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  barCode: string;
  category: Category;
}

export const formatMoney = (value: number): string => {
  if (!value) return "R$ 0,00"
  return "R$ " + value.toFixed(2).replace(".", ",");
};

export const formatBarCode = (codigo: string): string => {
  if (!/^\d{13}$/.test(codigo)) {
    throw new Error("O código de barras deve conter exatamente 13 dígitos numéricos.");
  }

  return `${codigo.slice(0, 1)}|${codigo.slice(1, 7)}|${codigo.slice(7, 13)}`;
}
