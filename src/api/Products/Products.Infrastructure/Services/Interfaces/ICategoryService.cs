using FluentResults;
using Products.Infrastructure.DTO;

namespace Products.Infrastructure.Services.Interfaces;

public interface ICategoryService : IService<Guid, CategoryDTO>
{
    Task<Result<CategoryDTO>> AddProduct(Guid categoryId, Guid productId);
    Task<Result<CategoryDTO>> RemoveProduct(Guid categoryId, Guid productId);
}
