using FluentResults;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;

namespace Products.Infrastructure.Services;

public class CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
    private readonly IProductRepository _productRepository = productRepository;

    public async Task<IEnumerable<CategoryDTO>> GetAllAsync(int skip, int take)
    {
        var categories = await _categoryRepository.GetAllAsync(skip, take);
        return categories.ToDTO();
    }

    public async Task<CategoryDTO> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category?.ToDTO();
    }

    public async Task<Result> CreateAsync(Guid createdBy, CategoryDTO entity)
    {
        var newEntity = new Category
        {
            Name = entity.Name.Trim(),
            CreatedBy = createdBy,
            UpdatedBy = createdBy
        };

        var result = await _categoryRepository.CreateAsync(newEntity);
        return Result.Ok().WithSuccess(result.Id.ToString());
    }

    public async Task<Result> UpdateAsync(Guid updatedBy, CategoryDTO entity)
    {
        var existingEntity = await _categoryRepository.GetByIdAsync(entity.Id);

        if (existingEntity is null)
            return Result.Fail("Category does not exists");

        existingEntity.Name = entity.Name.Trim();
        existingEntity.UpdatedBy = updatedBy;

        var result = await _categoryRepository.UpdateAsync(existingEntity);

        return result is not null ? Result.Ok() : Result.Fail("Could not update category");
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _categoryRepository.DeleteAsync(id);
    }

    public async Task<Result> AddProduct(Guid updatedBy, int categoryId, Guid productId)
    {
        var errors = new List<Error>();

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            errors.Add(new Error("Category does not exists"));

        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
            errors.Add(new Error("Product does not exists"));

        category.UpdatedBy = updatedBy;
        category.Products.Add(product);

        var result = await _categoryRepository.UpdateAsync(category);
        if (result is null)
            errors.Add(new Error("Could not add product to category"));

        if (errors.Count > 0) 
            return Result.Fail(errors);
        
        return Result.Ok();
    }

    public async Task<Result> RemoveProduct(Guid updatedBy, int categoryId, Guid productId)
    {
        var errors = new List<Error>();

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category is null)
            errors.Add(new Error("Category does not exists"));

        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
            errors.Add(new Error("Product does not exists"));

        category.UpdatedBy = updatedBy;
        category.Products.Remove(product);

        var result = await _categoryRepository.UpdateAsync(category);
        if (result is null)
            errors.Add(new Error("Could not remove product to category"));

        if (errors.Count > 0)
            return Result.Fail(errors);

        return Result.Ok();
    }
}
