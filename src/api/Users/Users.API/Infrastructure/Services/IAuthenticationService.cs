using FluentResults;

namespace Users.API.Infrastructure.Services;

public interface IAuthenticationService
{
    Task<Result> AuthenticateAsync(string identifier, string password);
}

public class AuthenticationService : IAuthenticationService
{
    private readonly IUserService _userService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJWTTokenGenerator _jwtTokenGenerator;

    public AuthenticationService(IUserService userService, IPasswordHasher passwordHasher, IJWTTokenGenerator jwtTokenGenerator)
    {
        _userService = userService;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result> AuthenticateAsync(string identifier, string password)
    {
        var identifierType = GetIdentifierType(identifier);

        var user = identifierType switch
        {
            IdentifierType.UserName => await _userService.GetByUserNameAsync(identifier),
            IdentifierType.Email => await _userService.GetByEmailAsync(identifier),
            IdentifierType.CPF => await _userService.GetByCPFAsync(identifier),
            _ => null
        };

        if (user is null)
        {
            return Result.Fail("User not found");
        }
        if (!_passwordHasher.VerifyHashedPassword(user.PasswordHash, password))
        {
            return Result.Fail("Invalid password");
        }
        return Result.Ok().WithSuccess(_jwtTokenGenerator.GenerateToken(user));
    }

    private static IdentifierType GetIdentifierType(string identifier)
    {
        if (identifier.Contains('@') && identifier.Contains('.'))
        {
            return IdentifierType.Email;
        }
        if (identifier.Length == 11 && identifier.All(char.IsDigit))
        {
            return IdentifierType.CPF;
        }
        return IdentifierType.UserName;
    }

    private enum IdentifierType
    {
        UserName,
        Email,
        CPF
    }
}
