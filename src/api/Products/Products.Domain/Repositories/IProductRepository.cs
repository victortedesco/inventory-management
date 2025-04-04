using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IProductRepository : IRepository<Guid, Product>
{
}
