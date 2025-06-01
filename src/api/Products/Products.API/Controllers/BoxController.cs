using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Products.API.Requests;
using Products.API.Requests.Boxes;
using Products.API.ViewModels;
using Products.Infrastructure.DTO;
using Products.Infrastructure.Services.Interfaces;
using System.Security.Claims;

namespace Products.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/boxes")]
public class BoxController(IBoxService boxService) : ControllerBase
{
    private readonly IBoxService _boxService = boxService;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<BoxViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] Pagination pagination)
    {
        var boxes = await _boxService.GetAllAsync(pagination.Skip, pagination.Take, pagination.Name);

        if (!boxes.Any())
            return NoContent();

        return Ok(boxes.ToViewModel());
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(BoxViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var box = await _boxService.GetByIdAsync(id);

        if (box is null)
            return NotFound();

        return Ok(box.ToViewModel());
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BoxViewModel), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateBoxRequest box)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _boxService.CreateAsync(new BoxDTO
        {
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.UnitPrice,
            Quantity = box.Quantity,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width
        });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value.ToViewModel());
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BoxViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBoxRequest box)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _boxService.UpdateAsync(new BoxDTO
        {
            Id = id,
            Name = box.Name,
            Discount = box.Discount,
            UnitPrice = box.UnitPrice,
            Quantity = box.Quantity,
            Weight = box.Weight,
            Depth = box.Depth,
            Height = box.Height,
            Width = box.Width
        });

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpPut("{boxId:guid}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BoxViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddProduct(Guid boxId, Guid productId)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _boxService.AddProduct(boxId, productId);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(result.Value.ToViewModel());
    }

    [HttpDelete("{boxId:guid}/products/{productId:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BoxViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveProduct(Guid boxId, Guid productId)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;

        if (userId is null)
            return Unauthorized();

        var result = await _boxService.RemoveProduct(boxId, productId);

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
        var result = await _boxService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}
