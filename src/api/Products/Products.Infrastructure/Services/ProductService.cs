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

    public async Task<IEnumerable<ProductDTO>> GetByCategoryIdAsync(Guid categoryId, int skip, int take, string name)
    {
        var products = await _productRepository.GetByCategoryIdAsync(categoryId, skip, take, name);
        return products.Select(p => p.ToDTO());
    }

    public async Task<Result<ProductDTO>> CreateAsync(ProductDTO entity)
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

        var category = await _categoryRepository.GetByIdAsync(entity.Category.Id);

        var product = new Product
        {
            Name = entity.Name,
            Image = entity.Image,
            UnitPrice = entity.UnitPrice,
            Quantity = entity.Quantity,
            Barcode = entity.Barcode,
            Category = category,
        };
        var createdProduct = await _productRepository.CreateAsync(product);
        return createdProduct.ToDTO();
    }

    public async Task<Result<ProductDTO>> UpdateAsync(ProductDTO entity)
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
        var category = await _categoryRepository.GetByIdAsync(entity.Category.Id);

        existingProduct.Name = entity.Name;
        existingProduct.Image = entity.Image;
        existingProduct.Quantity = entity.Quantity;
        existingProduct.Barcode = entity.Barcode;
        existingProduct.Category = category;
        existingProduct.UnitPrice = entity.UnitPrice;

        var updatedProduct = await _productRepository.UpdateAsync(existingProduct);
        return updatedProduct.ToDTO();
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product.Quantity != 0) return false;
        return await _productRepository.DeleteAsync(id);
    }

    public async Task<ProductDTO> UpdateQuantityAsync(Guid guid, int quantity)
    {
        var product = await _productRepository.GetByIdAsync(guid);
        if (product is null) return null;

        int tempQuantity = (int)product.Quantity + quantity;
        if (tempQuantity < 0) return null;

        product.Quantity = (uint)tempQuantity;

        var updatedProduct = await _productRepository.UpdateAsync(product);
        return updatedProduct.ToDTO();
    }
}
