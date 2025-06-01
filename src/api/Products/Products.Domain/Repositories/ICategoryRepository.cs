using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface ICategoryRepository : IRepository<Guid, Category>
{
    Task<Category> GetByNameAsync(string name);
}
