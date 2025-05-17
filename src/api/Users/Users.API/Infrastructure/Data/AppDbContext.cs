using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Users.API.Domain.Kernel;
using Users.API.Domain.Models;

namespace Users.API.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> ops) : DbContext(ops)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("users");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public async Task SeedDataAsync()
    {
        await AddDefaultRoles();
    }

    private async Task AddDefaultRoles()
    {
        if (!Roles.Any())
            Roles.AddRange(Enumeration.GetAll<Role>());

        await SaveChangesAsync();
    }
}
