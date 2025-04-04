using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.Infrastructure.Services.Interfaces;

namespace Products.API.Controllers;

[ApiController]
[Route("api/v1/categories")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    private readonly ICategoryService _categoryService = categoryService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Pagination pagination)
    {
        var categories = await _categoryService.GetAllAsync(pagination.Skip, pagination.Take);
        return Ok(categories);
    }

    [HttpGet("id/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category);
    }

}
