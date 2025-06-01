export default interface Box {
  id: string;
  image: string;
  barCode: string;
  name: string;
  discount: number;
  unitPrice: number;
  quantity: number;
  weight: number;
  depth: number;
  height: number;
  width: number;
  productCount: number;
  uniqueProductCount: number;
}
