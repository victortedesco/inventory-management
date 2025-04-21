using FluentResults;
using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface IBoxService : IService<Guid, BoxDTO>
{
    Task<Result<BoxDTO>> AddProduct(Guid updatedBy, Guid boxId, Guid productId);
    Task<Result<BoxDTO>> RemoveProduct(Guid updatedBy, Guid boxId, Guid productId);
}
