using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface ICategoryRepository : IRepository<int, Category>
{
}
