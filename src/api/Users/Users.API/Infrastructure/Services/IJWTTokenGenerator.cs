using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Users.API.Infrastructure.DTO;

namespace Users.API.Infrastructure.Services;


public interface IJWTTokenGenerator
{
    string GenerateToken(UserDTO user);
}

public class JWTTokenGenerator(IConfiguration configuration) : IJWTTokenGenerator
{
    private readonly IConfiguration _configuration = configuration;

    public string GenerateToken(UserDTO user)
    {
        var claims = new List<Claim>()
        {
            new("sub", user.Id.ToString()),
            new("jti", Guid.NewGuid().ToString()),
            new("name", user.UserName),
            new("role", user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}