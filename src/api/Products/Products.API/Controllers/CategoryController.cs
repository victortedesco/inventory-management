﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.API.Requests.Categories;
using Products.API.ViewModels;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;
using System.Security.Claims;

namespace Products.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/categories")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    private readonly ICategoryService _categoryService = categoryService;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<CategoryViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] Pagination pagination)
    {
        var categories = await _categoryService.GetAllAsync(pagination.Skip, pagination.Take, pagination.Name);

        if (!categories.Any())
            return NoContent();

        return Ok(categories.ToViewModel());
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(category.ToViewModel());
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest category)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.CreateAsync(Guid.Parse(userId), new CategoryDTO { Name = category.Name });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value.ToViewModel());
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryRequest category)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.UpdateAsync(Guid.Parse(userId), new CategoryDTO { Id = id, Name = category.Name });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpPut("{categoryId:int}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddProduct(int categoryId, Guid productId)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.AddProduct(Guid.Parse(userId), categoryId, productId);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpDelete("{categoryId:int}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(CategoryViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveProduct(int categoryId, Guid productId)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _categoryService.RemoveProduct(Guid.Parse(userId), categoryId, productId);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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
