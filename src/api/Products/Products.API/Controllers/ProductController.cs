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
public class ProductController(IProductService productService) : ControllerBase
{
    private readonly IProductService _productService = productService;

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

    [HttpGet("category/{categoryId:int}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<ProductViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCategoryId(int categoryId, [FromQuery] Pagination pagination)
    {
        var products = await _productService.GetByCategoryIdAsync(categoryId, pagination.Skip, pagination.Take, pagination.Name);

        if (!products.Any())
            return NoContent();

        return Ok(products.ToViewModel());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProductViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product is null)
            return NotFound();

        return Ok(product.ToViewModel());
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

        var result = await _productService.CreateAsync(Guid.Parse(userId), new ProductDTO
        {
            Name = product.Name,
            Image = product.Image,
            Barcode = product.Barcode,
            Category = new CategoryDTO { Id = int.Parse(product.CategoryId) },
            UnitPrice = product.UnitPrice,
            Quantity = product.Quantity,
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

        var result = await _productService.UpdateAsync(Guid.Parse(userId), new ProductDTO
        {
            Id = id,
            Name = product.Name,
            Image = product.Image,
            Barcode = product.Barcode,
            Category = new CategoryDTO { Id = int.Parse(product.CategoryId) },
            UnitPrice = product.UnitPrice,
            Quantity = product.Quantity,
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
}
