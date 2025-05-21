using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using System.Reflection;

namespace Products.Infrastructure.Data;

public class AppDbContext : DbContext
{
    private readonly string _currentUserId;

    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Box> Boxes { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
    {
        _currentUserId = httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value ?? "anonymous";
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("products");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override int SaveChanges()
    {
        AddAuditLogs();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddAuditLogs();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void AddAuditLogs()
    {
        ChangeTracker.DetectChanges();

        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified || e.State == EntityState.Added || e.State == EntityState.Deleted)
            .ToList();

        var auditLogs = new List<AuditLog>();

        foreach (var entry in entries)
        {
            var entityName = entry.Entity.GetType().Name;
            var entityId = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey())?.CurrentValue?.ToString();

            if (entry.State == EntityState.Added)
            {
                foreach (var prop in entry.Properties)
                {
                    auditLogs.Add(new AuditLog
                    {
                        ActionType = AuditActionType.Create,
                        EntityName = entityName,
                        EntityId = entityId,
                        Property = prop.Metadata.Name,
                        OldValue = null,
                        NewValue = prop.CurrentValue?.ToString(),
                        UserId = _currentUserId
                    });
                }
            }
            else if (entry.State == EntityState.Deleted)
            {
                foreach (var prop in entry.Properties)
                {
                    auditLogs.Add(new AuditLog
                    {
                        ActionType = AuditActionType.Delete,
                        EntityName = entityName,
                        EntityId = entityId,
                        Property = prop.Metadata.Name,
                        OldValue = prop.OriginalValue?.ToString(),
                        NewValue = null,
                        UserId = _currentUserId
                    });
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                foreach (var prop in entry.Properties)
                {
                    if (!Equals(prop.OriginalValue, prop.CurrentValue))
                    {
                        auditLogs.Add(new AuditLog
                        {
                            ActionType = AuditActionType.Update,
                            EntityName = entityName,
                            EntityId = entityId,
                            Property = prop.Metadata.Name,
                            OldValue = prop.OriginalValue?.ToString(),
                            NewValue = prop.CurrentValue?.ToString(),
                            UserId = _currentUserId
                        });
                    }
                }
            }
        }

        AuditLogs.AddRange(auditLogs);
    }
}
