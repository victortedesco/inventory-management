using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class ProductRepository(AppDbContext dbContext) : IProductRepository
{
    private readonly DbSet<Product> _products = dbContext.Products;

    public async Task<IEnumerable<Product>> GetAllAsync(int skip, int take)
    {
        return await _products
            .Skip(skip)
            .Take(take)
            .ToListAsync();
    }

    public async Task<Product> GetByIdAsync(Guid id)
    {
        return await _products.FindAsync(id);
    }

    public async Task<Product> GetByName(string name)
    {
        return await _products
            .FirstOrDefaultAsync(p => p.Name.ToLower() == name.ToLower());
    }

    public async Task<Product> CreateAsync(Product entity)
    {
        await _products.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<Product> UpdateAsync(Product entity)
    {
        _products.Update(entity);
        await dbContext.SaveChangesAsync();
        return entity;
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
