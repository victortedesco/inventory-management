using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Users.API.Application.Requests;
using Users.API.Application.ViewModels;
using Users.API.Infrastructure.DTO;
using Users.API.Infrastructure.Services;

namespace Users.API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/users")]
public class UserController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(IEnumerable<UserViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _service.GetAllAsync();

        if (!users.Any())
            return NoContent();

        return Ok(UserViewModel.FromDTO(users));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _service.GetByIdAsync(id);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpGet("user/{userName:minlength(3):minlength(16)}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByUserName(string userName)
    {
        var user = await _service.GetByUserNameAsync(userName);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpGet("email/{email:minlength(10):minlength(50)}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var user = await _service.GetByEmailAsync(email);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpGet("cpf/{cpf:minlength(11)}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCPF(string cpf)
    {
        var user = await _service.GetByCPFAsync(cpf);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpGet("displayName/{displayName:maxlength(32)}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(IEnumerable<UserViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByDisplayName(string displayName)
    {
        var users = await _service.GetByDisplayNameAsync(displayName);

        if (users is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(users));
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
    {
        var dto = new UserDTO
        {
            UserName = request.UserName,
            DisplayName = request.DisplayName,
            Email = request.Email,
            CPF = request.CPF,
            Password = request.Password,
            Role = request.Role
        };

        var result = await _service.CreateAsync(dto);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, UserViewModel.FromDTO(result.Value));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var dto = new UserDTO
        {
            Id = id,
            UserName = request.UserName,
            DisplayName = request.DisplayName,
            Email = request.Email,
            CPF = request.CPF,
            Password = request.Password,
            Role = request.Role
        };

        var result = await _service.UpdateAsync(dto);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok(UserViewModel.FromDTO(result.Value));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userRole = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

        if (userRole != "admin")
            return Forbid();

        var result = await _service.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}
