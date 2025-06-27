using FluentResults;
using Products.Domain.Models;
using Products.Domain.Repositories;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;

namespace Products.Infrastructure.Services;

public class BoxService(IProductRepository productRepository, IBoxRepository boxRepository) : IBoxService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IBoxRepository _boxRepository = boxRepository;

    public async Task<IEnumerable<BoxDTO>> GetAllAsync(int skip, int take, string name)
    {
        var boxes = await _boxRepository.GetAllAsync(skip, take, name);
        return boxes.ToDTO();
    }

    public async Task<BoxDTO> GetByIdAsync(Guid id)
    {
        var box = await _boxRepository.GetByIdAsync(id);
        return box?.ToDTO();
    }

    public async Task<IEnumerable<BoxDTO>> GetByProductIdAsync(Guid productId, int skip, int take, string name)
    {
        var boxes = await _boxRepository.GetByProductIdAsync(productId, skip, take, name);
        return boxes.ToDTO();
    }

    public async Task<Result<BoxDTO>> CreateAsync(BoxDTO entity)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(entity.Name))
            errors.Add("Box name is required");
        if (entity.Name.Length < 3)
            errors.Add("Box name must be at least 3 characters long");
        if (entity.Name.Length > 50)
            errors.Add("Box name must be at most 50 characters long");
        if (entity.Weight <= 0)
            errors.Add("Box weight must be greater than zero");
        if (entity.Depth <= 0)
            errors.Add("Box depth must be greater than zero");
        if (entity.Height <= 0)
            errors.Add("Box height must be greater than zero");
        if (entity.Width <= 0)
            errors.Add("Box width must be greater than zero");
        if (entity.Stock < 0)
            errors.Add("Box quantity must be greater than or equal to zero");
        if (entity.Discount < 0)
            errors.Add("Box discount must be greater than or equal to zero");
        if (entity.Discount > 80)
            errors.Add("Box discount must be at most 80");
        if (errors.Count != 0)
            return Result.Fail(errors);

        if (await GetByIdAsync(entity.Id) is not null)
            return Result.Fail("Box already exists");


        var newEntity = new Box
        {
            Name = entity.Name.Trim(),
            BarCode = entity.BarCode,
            Stock = entity.Stock,
            Discount = entity.Discount,
            Weight = entity.Weight,
            Depth = entity.Depth,
            Height = entity.Height,
            Width = entity.Width,
        };

        var result = await _boxRepository.CreateAsync(newEntity);
        return Result.Ok(result.ToDTO());
    }

    public async Task<Result<BoxDTO>> UpdateAsync(BoxDTO entity)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(entity.Name))
            errors.Add("Box name is required");
        if (entity.Name.Length < 3)
            errors.Add("Box name must be at least 3 characters long");
        if (entity.Name.Length > 50)
            errors.Add("Box name must be at most 50 characters long");
        if (entity.Weight <= 0)
            errors.Add("Box weight must be greater than zero");
        if (entity.Depth <= 0)
            errors.Add("Box depth must be greater than zero");
        if (entity.Height <= 0)
            errors.Add("Box height must be greater than zero");
        if (entity.Width <= 0)
            errors.Add("Box width must be greater than zero");
        if (entity.Stock < 0)
            errors.Add("Box quantity must be greater than or equal to zero");
        if (entity.Discount < 0)
            errors.Add("Box discount must be greater than or equal to zero");
        if (entity.Discount > 80)
            errors.Add("Box discount must be less or equal to 80");
        if (errors.Count != 0)
            return Result.Fail(errors);

        var existingBox = await _boxRepository.GetByIdAsync(entity.Id);

        if (existingBox is null)
            return Result.Fail("Box does not exists");

        existingBox.Name = entity.Name.Trim();
        existingBox.BarCode = entity.BarCode;
        existingBox.Stock = entity.Stock;
        existingBox.Weight = entity.Weight;
        existingBox.Depth = entity.Depth;
        existingBox.Height = entity.Height;
        existingBox.Width = entity.Width;
        existingBox.Discount = entity.Discount;

        var result = await _boxRepository.UpdateAsync(existingBox);
        if (result is null)
            return Result.Fail("Could not update box");

        return Result.Ok(result.ToDTO());
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _boxRepository.DeleteAsync(id);
    }

    public async Task<Result<BoxDTO>> AddProduct(Guid boxId, Guid productId)
    {
        var errors = new List<string>();

        var box = await _boxRepository.GetByIdAsync(boxId);

        if (box is null)
            errors.Add("Box does not exists");

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            errors.Add("Product does not exists");

        if (errors.Count > 0)
            return Result.Fail(errors);

        var productInBox = box.Products.FirstOrDefault(p => p.ProductId == productId);

        if (productInBox is not null)
            return Result.Fail("Product already exists in box");

        box.Products.Add(new ProductInBox
        {
            ProductId = productId,
            BoxId = boxId,
            Quantity = 0
        });
        var result = await _boxRepository.UpdateAsync(box);

        if (result is null)
            return Result.Fail("Could not add product to box");

        return Result.Ok(result.ToDTO());
    }

    public async Task<Result<BoxDTO>> RemoveProduct(Guid boxId, Guid productId)
    {
        var errors = new List<string>();

        var box = await _boxRepository.GetByIdAsync(boxId);

        if (box is null)
            errors.Add("Box does not exists");

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            errors.Add("Product does not exists");

        if (errors.Count > 0)
            return Result.Fail(errors);

        var productInBox = box.Products.FirstOrDefault(p => p.ProductId == productId);

        if (productInBox is null)
            return Result.Fail("Product does not exists in box");

        box.Products.Remove(productInBox);

        var result = await _boxRepository.UpdateAsync(box);

        if (result is null)
            return Result.Fail("Could not remove product from box");

        return Result.Ok(result.ToDTO());
    }

    public async Task<Result<BoxDTO>> UpdateProductQuantityAsync(Guid boxId, Guid productId, uint quantity)
    {
        var errors = new List<string>();

        var box = await _boxRepository.GetByIdAsync(boxId);

        if (box is null)
            errors.Add("Box does not exists");

        var product = await _productRepository.GetByIdAsync(productId);

        if (product is null)
            errors.Add("Product does not exists");

        if (errors.Count > 0)
            return Result.Fail(errors);

        var productInBox = box.Products.FirstOrDefault(p => p.ProductId == productId);

        if (productInBox is null)
            return Result.Fail("Product does not exists in box");

        productInBox.Quantity = Math.Max(0, quantity);
        var result = await _boxRepository.UpdateAsync(box);

        if (result is null)
            return Result.Fail("Could not update product quantity in box");

        return Result.Ok(result.ToDTO());
    }

    public async Task<BoxDTO> UpdateStockAsync(Guid boxId, uint stock)
    {
        var box = await _boxRepository.GetByIdAsync(boxId);
        if (box is null)
            return null;
        box.Stock = Math.Max(0, stock);
        var result = await _boxRepository.UpdateAsync(box);
        return result?.ToDTO();
    }
}
