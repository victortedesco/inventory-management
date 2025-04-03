using Microsoft.EntityFrameworkCore;
using Users.API.Domain;
using Users.API.Domain.Models;

namespace Users.API.Infrastructure.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> GetByIdAsync(Guid id);
    Task<User> GetByUserNameAsync(string userName);
    Task<User> GetByCPFAsync(string cpf);
    Task<User> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetByDisplayNameAsync(string displayName);
    Task<bool> CreateAsync(User user);
    Task<bool> UpdateAsync(User user);
    Task<bool> DeleteAsync(Guid id);
}

public class UserRepository(AppDbContext context) : IUserRepository
{
    private readonly DbSet<User> _users = context.Users;

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _users.ToListAsync();
    }

    public async Task<User> GetByIdAsync(Guid id)
    {
        return await _users.FindAsync(id);
    }

    public async Task<User> GetByUserNameAsync(string userName)
    {
        return await _users.FirstOrDefaultAsync(u => u.UserName == userName);
    }

    public async Task<User> GetByCPFAsync(string cpf)
    {
        return await _users.FirstOrDefaultAsync(u => u.CPF == cpf);
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        return await _users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetByDisplayNameAsync(string displayName)
    {
        return await _users.Where(u => u.DisplayName.Contains(displayName)).ToListAsync();
    }

    public async Task<bool> CreateAsync(User user)
    {
        await _users.AddAsync(user);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateAsync(User user)
    {
        if (await GetByIdAsync(user.Id) is null)
            return false;

        _users.Update(user);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await GetByIdAsync(id);
        if (user is null)
            return false;

        _users.Remove(user);
        return await context.SaveChangesAsync() > 0;
    }
}
