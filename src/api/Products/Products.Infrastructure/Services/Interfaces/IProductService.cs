using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface IProductService : IService<Guid, ProductDTO>
{
}
