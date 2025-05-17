using Microsoft.EntityFrameworkCore;
using Users.API.Domain.Models;
using Users.API.Infrastructure.Data;

namespace Users.API.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> GetByIdAsync(Guid id);
    Task<User> GetByUserNameAsync(string userName);
    Task<User> GetByCPFAsync(string cpf);
    Task<User> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByDisplayNameAsync(string displayName);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(Guid id);
}

public class UserRepository(AppDbContext context) : IUserRepository
{
    private readonly AppDbContext _context = context;
    private readonly DbSet<User> _users = context.Users;

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _users.Include(u => u.Role).ToListAsync();
    }

    public async Task<User> GetByIdAsync(Guid id)
    {
        var user = await _users.FindAsync(id);
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        return user;
    }

    public async Task<User> GetByUserNameAsync(string userName)
    {
        var user = await _users.FirstOrDefaultAsync(u => u.UserName == userName);
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        return user;
    }

    public async Task<User> GetByCPFAsync(string cpf)
    {
        var user = await _users.FirstOrDefaultAsync(u => u.CPF == cpf);
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        return user;
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        var user = await _users.FirstOrDefaultAsync(u => u.Email == email);
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        return user;
    }

    public async Task<IEnumerable<User>> GetByDisplayNameAsync(string displayName)
    {
        return await _users.Include(u => u.Role).Where(u => u.DisplayName.Contains(displayName)).ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        var newUser = await _users.AddAsync(user);

        await _context.SaveChangesAsync();
        await _context.Entry(newUser.Entity).Reference(u => u.Role).LoadAsync();

        return newUser.Entity;
    }

    public async Task<User> UpdateAsync(User user)
    {
        if (await GetByIdAsync(user.Id) is null)
            return null;

        var updatedUser = _users.Update(user);
        await _context.SaveChangesAsync();
        await _context.Entry(updatedUser.Entity).Reference(u => u.Role).LoadAsync();

        return updatedUser.Entity;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);

        if (user is null)
            return false;

        _users.Remove(user);
        return await _context.SaveChangesAsync() > 0;
    }
}
