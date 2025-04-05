using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext dbContext) : ICategoryRepository
{
    private readonly DbSet<Category> _categories = dbContext.Categories;

    public async Task<IEnumerable<Category>> GetAllAsync(int skip, int take)
    {
        return await _categories
            .OrderBy(c => c.Id)
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<Category> GetByIdAsync(int id)
    {
        return await _categories.FindAsync(id);
    }

    public async Task<Category> GetByName(string name)
    {
        return await _categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == name.ToLower());
    }

    public async Task<Category> CreateAsync(Category entity)
    {
        await _categories.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<Category> UpdateAsync(Category entity)
    {
        _categories.Update(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
            return false;
        _categories.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
