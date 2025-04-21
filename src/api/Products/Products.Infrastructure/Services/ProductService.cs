using FluentResults;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;

namespace Products.Infrastructure.Services;

public class ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public async Task<IEnumerable<ProductDTO>> GetAllAsync(int skip, int take, string name)
    {
        var products = await _productRepository.GetAllAsync(skip, take, name);
        return products.Select(p => p.ToDTO());
    }

    public async Task<ProductDTO> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product?.ToDTO();
    }

    public async Task<Result<ProductDTO>> CreateAsync(Guid createdBy, ProductDTO entity)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(entity.Name))
        {
            errors.Add("Name cannot be empty");
        }
        if (entity.UnitPrice <= 0)
        {
            errors.Add("Unit price must be greater than zero");
        }
        if (entity.Quantity < 0)
        {
            errors.Add("Quantity cannot be negative");
        }
        if (errors.Count != 0)
        {
            return Result.Fail(errors);
        }

        var product = new Product
        {
            Name = entity.Name,
            Image = entity.Image,
            UnitPrice = entity.UnitPrice,
            Quantity = entity.Quantity,
            CreatedBy = createdBy,
            UpdatedBy = createdBy
        };
        var createdProduct = await _productRepository.CreateAsync(product);
        return createdProduct.ToDTO();
    }

    public async Task<Result<ProductDTO>> UpdateAsync(Guid updatedBy, ProductDTO entity)
    {
        var errors = new List<string>();

        var existingProduct = await _productRepository.GetByIdAsync(entity.Id);
        if (existingProduct is null)
        {
            return Result.Fail($"Product with id {entity.Id} not found");
        }
        if (string.IsNullOrWhiteSpace(entity.Name))
        {
            errors.Add("Name cannot be empty");
        }
        if (entity.UnitPrice <= 0)
        {
            errors.Add("Unit price must be greater than zero");
        }
        if (entity.Quantity < 0)
        {
            errors.Add("Quantity cannot be negative");
        }
        if (errors.Count != 0)
        {
            return Result.Fail(errors);
        }

        existingProduct.Name = entity.Name;
        existingProduct.Image = entity.Image;
        existingProduct.Quantity = entity.Quantity;
        existingProduct.UnitPrice = entity.UnitPrice;
        existingProduct.UpdatedBy = updatedBy;

        var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
        return updatedProduct.ToDTO();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _productRepository.DeleteAsync(id);
    }
}
