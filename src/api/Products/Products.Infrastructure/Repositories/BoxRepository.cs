using Microsoft.EntityFrameworkCore;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;

namespace Products.Infrastructure.Repositories;

public class BoxRepository(AppDbContext dbContext) : IBoxRepository
{
    private readonly DbSet<Box> _boxes = dbContext.Boxes;

    public async Task<IEnumerable<Box>> GetAllAsync(int skip, int take, string name)
    {
        return await _boxes
            .OrderByDescending(c => c.CreatedAt)
            .Skip(skip)
            .Take(take)
            .Include(b => b.Products)
            .Where(b => string.IsNullOrEmpty(name) || b.Name.ToLower().Contains(name.ToLower()))
            .ToListAsync();
    }

    public async Task<Box> GetByIdAsync(Guid id)
    {
        return await _boxes.Include(b => b.Products).FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Box> CreateAsync(Box entity)
    {
        var result = await _boxes.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        dbContext.Entry(result.Entity).Collection(b => b.Products).Load();
        return result.Entity;
    }

    public async Task<Box> UpdateAsync(Box entity)
    {
        var result = _boxes.Update(entity);
        await dbContext.SaveChangesAsync();
        dbContext.Entry(result.Entity).Collection(b => b.Products).Load();
        return result.Entity;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
            return false;
        _boxes.Remove(entity);
        return await dbContext.SaveChangesAsync() > 0;
    }
}
