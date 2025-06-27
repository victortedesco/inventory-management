using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class AuditLogRepository(AppDbContext context) : IAuditLogRepository
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<AuditLog>> GetAllAsync(int skip, int take)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByEntityNameAsync(int skip, int take, string entityName)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Where(u => u.EntityName.ToLower().Contains(entityName.ToLower())).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByEntityIdAsync(int skip, int take, string entityId)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Where(u => u.EntityId == entityId).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByEntityTypeAsync(int skip, int take, string entityType)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Where(u => u.EntityType.ToLower().Contains(entityType.ToLower())).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(int skip, int take, string userId)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Where(u => u.UserId == userId).Skip(skip).Take(take).ToListAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetByActionTypeAsync(int skip, int take, AuditActionType actionType)
    {
        return await _context.AuditLogs.OrderByDescending(c => c.Timestamp).Where(u => u.ActionType == actionType).Skip(skip).Take(take).ToListAsync();
    }
}
