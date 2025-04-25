using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface IProductService : IService<Guid, ProductDTO>
{
    Task<IEnumerable<ProductDTO>> GetByCategoryIdAsync(int categoryId, int skip, int take, string name);
}
