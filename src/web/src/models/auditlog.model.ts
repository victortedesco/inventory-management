export enum AuditActionType {
  Create = "Create",
  Update = "Update",
  Delete = "Delete",
}

export default interface AuditLog {
  id: number;
  actionType: AuditActionType;
  entityName: string;
  entityId: string;
  property: string;
  oldValue: string;
  newValue: string;
  userId: string;
  timestamp: Date;
}
