using FluentResults;
using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface IBoxService : IService<Guid, BoxDTO>
{
    Task<Result<BoxDTO>> AddProduct(Guid boxId, Guid productId);
    Task<Result<BoxDTO>> RemoveProduct(Guid boxId, Guid productId);
    Task<IEnumerable<BoxDTO>> GetByProductIdAsync(Guid productId, int skip, int take, string name);
    Task<Result<BoxDTO>> UpdateProductQuantityAsync(Guid boxId, Guid productId, uint quantity);
    Task<BoxDTO> UpdateStockAsync(Guid boxId, uint stock);
}
