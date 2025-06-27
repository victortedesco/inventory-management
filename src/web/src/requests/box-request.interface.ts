export interface CreateBoxRequest {
  barCode: string;
  name: string;
  discount: number;
  unitPrice: number;
  quantity: number;
  weight: number;
  depth: number;
  height: number;
  width: number;
}

export interface UpdateBoxRequest {
  id: string;
  barCode: string;
  name: string;
  discount: number;
  unitPrice: number;
  quantity: number;
  weight: number;
  depth: number;
  height: number;
  width: number;
}
