using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IProductRepository : IRepository<Guid, Product>
{
    Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId, int skip, int take, string name);
}
