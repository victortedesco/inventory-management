using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IBoxRepository : IRepository<Guid, Box>
{
    Task<IEnumerable<Box>> GetByProductIdAsync(Guid productId, int skip, int take, string name);
}
