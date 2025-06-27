using Microsoft.EntityFrameworkCore;
using Users.API.Domain.Models;
using Users.API.Infrastructure.Data;

namespace Users.API.Infrastructure.Repositories;

public interface IRoleRepository
{
    public Task<IEnumerable<Role>> GetAllAsync();
    public Task<Role> GetByIdAsync(int id);
    public Task<Role> GetByNameAsync(string name);
    public Task<Role> CreateAsync(Role role);
    public Task<Role> UpdateAsync(Role role);
    public Task<bool> DeleteAsync(int id);
}

public class RoleRepository(AppDbContext context) : IRoleRepository
{
    private readonly AppDbContext _context = context;
    private readonly DbSet<Role> _roles = context.Roles;

    public async Task<IEnumerable<Role>> GetAllAsync()
    {
        return await _roles.ToListAsync();
    }

    public async Task<Role> GetByIdAsync(int id)
    {
        return await _roles.FindAsync(id);
    }

    public async Task<Role> GetByNameAsync(string name)
    {
        return await _roles.FirstOrDefaultAsync(r => r.Name.ToLower() == name.ToLower());
    }

    public async Task<Role> CreateAsync(Role role)
    {
        var newRole = await _roles.AddAsync(role);
        await _context.SaveChangesAsync();
        return newRole.Entity;
    }

    public async Task<Role> UpdateAsync(Role role)
    {
        var updatedRole = _roles.Update(role);
        await _context.SaveChangesAsync();
        return updatedRole.Entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var role = await GetByIdAsync(id);

        if (role is null)
            return false;

        _roles.Remove(role);
        return await _context.SaveChangesAsync() > 0;
    }
}
