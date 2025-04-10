using Users.API.Domain.Models;

namespace Users.API.Infrastructure.DTO;

public class UserDTO
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string CPF { get; set; }
    public string Role { get; set; }
    public string Password { get; set; }

    public static UserDTO FromModel(User user)
    {
        return new UserDTO
        {
            Id = user.Id,
            UserName = user.UserName,
            DisplayName = user.DisplayName,
            Email = user.Email,
            CPF = user.CPF,
            Role = user.Role,
            Password = user.Password
        };
    }

    public static IEnumerable<UserDTO> FromModel(IEnumerable<User> users)
    {
        return users.Select(FromModel);
    }
}