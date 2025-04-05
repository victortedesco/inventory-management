using FluentResults;
using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface ICategoryService : IService<int, CategoryDTO>
{
    Task<Result<CategoryDTO>> AddProduct(Guid updatedBy, int categoryId, Guid productId);
    Task<Result<CategoryDTO>> RemoveProduct(Guid updatedBy, int categoryId, Guid productId);
}
