using Products.Domain.Models;
using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface IAuditLogService
{
    Task<IEnumerable<AuditLogDTO>> GetByEntityNameAsync(int skip, int take, string entityName);
    Task<IEnumerable<AuditLogDTO>> GetByEntityIdAsync(int skip, int take, string entityId);
    Task<IEnumerable<AuditLogDTO>> GetByUserIdAsync(int skip, int take, string userId);
    Task<IEnumerable<AuditLogDTO>> GetByActionTypeAsync(int skip, int take, AuditActionType actionType);
}
