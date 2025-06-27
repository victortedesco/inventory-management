using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.API.Requests.Products;
using Products.API.ViewModels;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;
using System.Security.Claims;

namespace Products.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/products")]
public class ProductController(IProductService productService, IBoxService boxService) : ControllerBase
{
    private readonly IProductService _productService = productService;
    private readonly IBoxService _boxService = boxService;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] Pagination pagination)
    {
        var products = await _productService.GetAllAsync(pagination.Skip, pagination.Take, pagination.Name);

        if (!products.Any())
            return NoContent();

        return Ok(products.ToViewModel());
    }

    [HttpGet("category/{categoryId:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCategoryId(Guid categoryId, [FromQuery] Pagination pagination)
    {
        var products = await _productService.GetByCategoryIdAsync(categoryId, pagination.Skip, pagination.Take, pagination.Name);

        if (!products.Any())
            return NoContent();

        return Ok(products.ToViewModel());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProductWithBoxesViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        var boxes = await _boxService.GetByProductIdAsync(id, 0, 100, string.Empty);

        if (product is null)
            return NotFound();

        return Ok(product.ToViewModelWithBoxes(boxes));
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProductViewModel), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest product)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _productService.CreateAsync(new ProductDTO
        {
            Name = product.Name,
            Image = product.Image,
            BarCode = product.BarCode,
            Category = new CategoryDTO { Id = Guid.Parse(product.CategoryId) },
            UnitPrice = product.UnitPrice,
            Stock = product.Quantity,
        });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value.ToViewModel());
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProductViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest product)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _productService.UpdateAsync(new ProductDTO
        {
            Id = id,
            Name = product.Name,
            Image = product.Image,
            BarCode = product.BarCode,
            Category = new CategoryDTO { Id = Guid.Parse(product.CategoryId) },
            UnitPrice = product.UnitPrice,
            Stock = product.Stock,
        });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _productService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpPatch("{id:guid}/stock")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateStock(Guid id, [FromBody] uint stock)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
        if (userId is null)
            return Unauthorized();
        var result = await _productService.UpdateStockAsync(id, stock);
        if (result == null)
            return BadRequest();
        return Ok(result.ToViewModel());
    }
}
