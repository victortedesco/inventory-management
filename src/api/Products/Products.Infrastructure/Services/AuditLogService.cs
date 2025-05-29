using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;

namespace Products.Infrastructure.Services;

public class AuditLogService(IAuditLogRepository auditLogRepository) : IAuditLogService
{
    private readonly IAuditLogRepository _auditLogRepository = auditLogRepository;

    public async Task<IEnumerable<AuditLogDTO>> GetAllAsync(int skip, int take)
    {
        var auditLogs = await _auditLogRepository.GetAllAsync(skip, take);
        return auditLogs.ToDTO();
    }

    public async Task<IEnumerable<AuditLogDTO>> GetByActionTypeAsync(int skip, int take, AuditActionType actionType)
    {
        var auditLogs = await _auditLogRepository.GetByActionTypeAsync(skip, take, actionType);
        return auditLogs.ToDTO();
    }

    public async Task<IEnumerable<AuditLogDTO>> GetByEntityIdAsync(int skip, int take, string entityId)
    {
        var auditLogs = await _auditLogRepository.GetByEntityIdAsync(skip, take, entityId);
        return auditLogs.ToDTO();
    }

    public async Task<IEnumerable<AuditLogDTO>> GetByEntityNameAsync(int skip, int take, string entityName)
    {
        var auditLogs = await _auditLogRepository.GetByEntityNameAsync(skip, take, entityName);
        return auditLogs.ToDTO();
    }

    public async Task<IEnumerable<AuditLogDTO>> GetByUserIdAsync(int skip, int take, string userId)
    {
        var auditLogs = await _auditLogRepository.GetByUserIdAsync(skip, take, userId);
        return auditLogs.ToDTO();
    }
}
