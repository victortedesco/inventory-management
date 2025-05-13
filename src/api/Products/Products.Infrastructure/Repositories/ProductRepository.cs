using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class ProductRepository(AppDbContext dbContext) : IProductRepository
{
    private readonly DbSet<Product> _products = dbContext.Products;

    public async Task<IEnumerable<Product>> GetAllAsync(int skip, int take, string name)
    {
        return await _products
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Where(p => string.IsNullOrEmpty(name) || p.Name.ToLower().Contains(name.ToLower()))
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId, int skip, int take, string name)
    {
        return await _products
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Include(p => p.Category)
            .Where(p => p.Category.Id == categoryId && (string.IsNullOrEmpty(name) || p.Name.ToLower().Contains(name.ToLower())))
            .ToListAsync();
    }

    public async Task<Product> CreateAsync(Product entity)
    {
        var result = await _products.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        dbContext.Entry(result.Entity).Reference(p => p.Category).Load();
        return result.Entity;
    }

    public async Task<Product> UpdateAsync(Product entity)
    {
        var result = _products.Update(entity);
        await dbContext.SaveChangesAsync();
        dbContext.Entry(result.Entity).Reference(p => p.Category).Load();
        return result.Entity;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
            return false;
        _products.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
