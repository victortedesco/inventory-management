using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IAuditLogRepository
{
    Task<IEnumerable<AuditLog>> GetAllAsync(int skip, int take);
    Task<IEnumerable<AuditLog>> GetByEntityNameAsync(int skip, int take, string entityName);
    Task<IEnumerable<AuditLog>> GetByEntityIdAsync(int skip, int take, string entityId);
    Task<IEnumerable<AuditLog>> GetByEntityTypeAsync(int skip, int take, string entityType);
    Task<IEnumerable<AuditLog>> GetByUserIdAsync(int skip, int take, string userId);
    Task<IEnumerable<AuditLog>> GetByActionTypeAsync(int skip, int take, AuditActionType actionType);
}
