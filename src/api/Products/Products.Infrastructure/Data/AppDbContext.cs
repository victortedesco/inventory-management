using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using System.Reflection;
using System.Security.Claims;

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
        _currentUserId = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value ?? "anonymous";
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
            var entityType = entry.Entity.GetType().Name;
            var entityName = entry.Entity.GetType().GetProperty("Name")?.GetValue(entry.Entity)?.ToString();
            var entityId = entry.Entity.GetType().GetProperty("Id")?.GetValue(entry.Entity).ToString();

            if (entry.State == EntityState.Added)
            {
                foreach (var prop in entry.Properties)
                {
                    var allowedProps = new[] { "Name" };
                    var newValue = prop.CurrentValue;

                    if (!allowedProps.Contains(prop.Metadata.Name))
                        continue;

                    if (newValue == null || IsDefaultValue(newValue))
                        continue;

                    auditLogs.Add(new AuditLog
                    {
                        ActionType = AuditActionType.Create,
                        EntityType = entityType,
                        EntityName = entityName,
                        EntityId = entityId,
                        Property = prop.Metadata.Name,
                        OldValue = null,
                        NewValue = newValue.ToString(),
                        UserId = _currentUserId
                    });
                }
            }
            else if (entry.State == EntityState.Deleted)
            {
                foreach (var prop in entry.Properties)
                {
                    var allowedProps = new[] { "Name" };
                    var newValue = prop.CurrentValue;

                    if (!allowedProps.Contains(prop.Metadata.Name))
                        continue;

                    if (newValue == null || IsDefaultValue(newValue))
                        continue;

                    auditLogs.Add(new AuditLog
                    {
                        ActionType = AuditActionType.Delete,
                        EntityType = entityType,
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
                            EntityType = entityType,
                            EntityName = entityName,
                            EntityId = entityId,
                            Property = prop.Metadata.Name,
                            OldValue = prop.Metadata.Name != "Image" ? prop.OriginalValue?.ToString() : null,
                            NewValue = prop.Metadata.Name != "Image" ? prop.CurrentValue?.ToString() : null,
                            UserId = _currentUserId
                        });
                    }
                }
            }
        }

        AuditLogs.AddRange(auditLogs);
    }


    private bool IsDefaultValue(object value)
    {
        if (value == null) return true;

        var type = value.GetType();

        if (type.IsValueType)
        {
            return value.Equals(Activator.CreateInstance(type));
        }

        return false;
    }
}
