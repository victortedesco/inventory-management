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

    public async Task<IEnumerable<CategoryDTO>> GetAllAsync(int skip, int take, string name)
    {
        var categories = await _categoryRepository.GetAllAsync(skip, take, name);
        return categories.ToDTO();
    }

    public async Task<CategoryDTO> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category?.ToDTO();
    }

    public async Task<CategoryDTO> GetByNameAsync(string name)
    {
        var category = await _categoryRepository.GetByNameAsync(name);
        return category?.ToDTO();
    }

    public async Task<Result<CategoryDTO>> CreateAsync(Guid createdBy, CategoryDTO entity)
    {
        if (await GetByNameAsync(entity.Name) is not null)
            return Result.Fail("Category already exists");
        if (string.IsNullOrWhiteSpace(entity.Name))
            return Result.Fail("Category name is required");
        if (entity.Name.Length < 3)
            return Result.Fail("Category name must be at least 3 characters long");
        if (entity.Name.Length > 50)
            return Result.Fail("Category name must be at most 50 characters long");

        var newEntity = new Category
        {
            Name = entity.Name.Trim(),
            CreatedBy = createdBy,
            UpdatedBy = createdBy
        };

        var result = await _categoryRepository.CreateAsync(newEntity);
        return Result.Ok(result.ToDTO());
    }

    public async Task<Result<CategoryDTO>> UpdateAsync(Guid updatedBy, CategoryDTO entity)
    {
        var errors = new List<string>();
        if (string.IsNullOrWhiteSpace(entity.Name))
            errors.Add("Category name is required");
        if (entity.Name.Length < 3)
            errors.Add("Category name must be at least 3 characters long");
        if (entity.Name.Length > 50)
            errors.Add("Category name must be at most 50 characters long");

        if (errors.Count != 0)
            return Result.Fail(errors);

        var existingEntity = await _categoryRepository.GetByIdAsync(entity.Id);

        if (existingEntity is null)
            return Result.Fail("Category does not exists");

        if (await _categoryRepository.GetByNameAsync(entity.Name) is not null && !existingEntity.Name.Equals(entity.Name, StringComparison.CurrentCultureIgnoreCase))
            return Result.Fail("Category already exists");

        existingEntity.Name = entity.Name.Trim();
        existingEntity.UpdatedBy = updatedBy;

        var result = await _categoryRepository.UpdateAsync(existingEntity);

        if (result is null)
            return Result.Fail("Could not update category");

        return Result.Ok(result.ToDTO());
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _categoryRepository.DeleteAsync(id);
    }

    public async Task<Result<CategoryDTO>> AddProduct(Guid updatedBy, int categoryId, Guid productId)
    {
        var errors = new List<string>();

        var category = await _categoryRepository.GetByIdAsync(categoryId);

        if (category is null)
            errors.Add("Category does not exists");

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            errors.Add("Product does not exists");

        if (errors.Count > 0)
            return Result.Fail(errors);

        category.UpdatedBy = updatedBy;
        category.Products.Add(product);

        var result = await _categoryRepository.UpdateAsync(category);

        if (result is null)
            return Result.Fail("Could not add product to category");

        return Result.Ok(result.ToDTO());
    }

    public async Task<Result<CategoryDTO>> RemoveProduct(Guid updatedBy, int categoryId, Guid productId)
    {
        var errors = new List<string>();

        var category = await _categoryRepository.GetByIdAsync(categoryId);

        if (category is null)
            errors.Add("Category does not exists");

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            errors.Add("Product does not exists");

        if (errors.Count > 0)
            return Result.Fail(errors);

        category.UpdatedBy = updatedBy;
        category.Products.Remove(product);

        var result = await _categoryRepository.UpdateAsync(category);

        if (result is null)
            return Result.Fail("Could not remove product from category");

        return Result.Ok(result.ToDTO());
    }
}
