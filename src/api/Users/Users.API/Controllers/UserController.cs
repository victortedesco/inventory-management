using Microsoft.AspNetCore.Mvc;
using Users.API.Application.Requests;
using Users.API.Application.ViewModels;
using Users.API.Infrastructure.DTO;
using Users.API.Infrastructure.Services;

namespace Users.API.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserController(IUserService service) : ControllerBase
{
    private readonly IUserService _service = service;

    [HttpGet]
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
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCPF(string cpf)
    {
        var user = await _service.GetByCPFAsync(cpf);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpGet("displayName/{displayName:minlength(5):maxlength(32)}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(IEnumerable<UserViewModel>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByDisplayName(string displayName)
    {
        var user = await _service.GetByDisplayNameAsync(displayName);

        if (user is null)
            return NotFound();

        return Ok(UserViewModel.FromDTO(user));
    }

    [HttpPost]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Add([FromBody] UpdateUserRequest request)
    {
        var dto = new UserDTO(default, request.UserName, request.DisplayName, request.Email, request.CPF, default, request.Password);

        var result = await _service.CreateAsync(dto);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return CreatedAtAction(nameof(GetById), new { id = result.Successes.First() }, result.Successes.First());
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var dto = new UserDTO(id, request.UserName, request.DisplayName, request.Email, request.CPF, default, request.Password);
        var result = await _service.UpdateAsync(dto);

        if (result.IsFailed)
            return BadRequest(result.Errors.Select(e => e.Message));

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }
}
