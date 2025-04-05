using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.API.ViewModels;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;

namespace Products.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/categories")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    private readonly ICategoryService _categoryService = categoryService;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] Pagination pagination)
    {
        var categories = await _categoryService.GetAllAsync(pagination.Skip, pagination.Take);

        if (!categories.Any())
            return NoContent();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest category)
    {
        var userId = HttpContext.User.FindFirst("sub")?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.CreateAsync(Guid.Parse(userId), new CategoryDTO { Name = category.Name });

        if (result.IsFailed)
            return BadRequest(result.Errors);

        return CreatedAtAction(nameof(GetById), new { id = result.Successes.First() }, category);
    }

    [HttpPost("{categoryId:int}/product/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddProduct(int categoryId, Guid productId)
    {
        var userId = HttpContext.User.FindFirst("sub")?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.AddProduct(Guid.Parse(userId), categoryId, productId);

        if (result.IsFailed)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [HttpDelete("{categoryId:int}/product/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RemoveProduct(int categoryId, Guid productId)
    {
        var userId = HttpContext.User.FindFirst("sub")?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.RemoveProduct(Guid.Parse(userId), categoryId, productId);

        if (result.IsFailed)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _categoryService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}
