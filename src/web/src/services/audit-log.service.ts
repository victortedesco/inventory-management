import { AuditLog } from "@/models/auditlog.model";

const AUDIT_LOG_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL + "/api/v1/auditlogs";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`, // Descomente se precisar de autenticação
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar: ${response.statusText}`);
  }

  if (response.status === 204) {
    return [] as T;
  }

  return await response.json();
}

export const getAllAuditLogs = (): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}`);
};

export const getAuditLogByEntityType = (entityType: 'Box' | 'Category' | 'Product'): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}/entity/type/${entityType}`);
}

export const getAuditLogsByEntityId = (entityId: string): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}/entity/${entityId}`);
};

export const getAuditLogsByEntityName = (entityName: string): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}/entity/name/${entityName}`);
}

export const getAuditLogsByUserId = (userId: string): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}/user/${userId}`);
};

export const getAuditLogsByActionType = (actionType: 'Create' | 'Update' | 'Delete'): Promise<AuditLog[]> => {
  return fetchJson<AuditLog[]>(`${AUDIT_LOG_API_URL}/action/${actionType}`);
};


