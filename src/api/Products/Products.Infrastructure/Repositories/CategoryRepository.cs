using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext dbContext) : ICategoryRepository
{
    private readonly DbSet<Category> _dbSet = dbContext.Categories;

    public async Task<IEnumerable<Category>> GetAllAsync(int skip, int take)
    {
        return await _dbSet
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<Category> GetByIdAsync(int id)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> CreateAsync(Category entity)
    {
        await _dbSet.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<Category> UpdateAsync(Category entity)
    {
        _dbSet.Update(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
            return false;
        _dbSet.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
