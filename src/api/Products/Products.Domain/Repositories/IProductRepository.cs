using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IProductRepository : IRepository<Guid, Product>
{
    Task<IEnumerable<Product>> GetByCategoryIdAsync(int categoryId, int skip, int take, string name);
}
