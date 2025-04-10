using Microsoft.AspNetCore.Mvc;
using Users.API.Application.Requests;
using Users.API.Infrastructure.Services;

namespace Users.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthenticationController(IAuthenticationService authenticationService) : ControllerBase
{
    public readonly IAuthenticationService _authenticationService = authenticationService;

    [HttpPost("login")]
    [ProducesResponseType(typeof(string), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authenticationService.AuthenticateAsync(request.Identifier, request.Password);

        if (result.IsFailed)
            return Unauthorized(result.Errors.First().Message);

        return Ok(result.Successes.First().Message);
    }
}
