export type AuditActionType = 'Create' | 'Update' | 'Delete';

export interface AuditLog {
  id: string;
  actionType: AuditActionType;
  entityType: string;
  entityName: string;
  entityId: string;
  property: string;
  oldValue: string;
  newValue: string;
  userId: string;
  timestamp: string;
}

export const fieldTranslations: Record<string, string> = {
  name: 'Nome',
  image: 'Imagem',
  barcode: 'Código de Barras',
  discount: 'Desconto',
  unitprice: 'Preço Unitário',
  quantity: 'Quantidade',
  weight: 'Peso',
  depth: 'Profundidade',
  height: 'Altura',
  width: 'Largura',
  category: 'Categoria',
  product: 'Produto',
  box: 'Caixa',
};

export function translateField(field: string): string {
  return fieldTranslations[field.toLowerCase()] || field;
}

export function formatDate(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();

  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}
