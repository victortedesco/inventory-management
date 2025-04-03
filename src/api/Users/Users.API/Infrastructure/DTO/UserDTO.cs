using Users.API.Domain.Models;

namespace Users.API.Infrastructure.DTO;

public record UserDTO(Guid Id, string UserName, string DisplayName, string Email, string CPF, string Role, string PasswordHash)
{
    public static UserDTO FromModel(User user)
    {
        return new UserDTO(user.Id, user.UserName, user.DisplayName, user.Email, user.CPF, user.Role, user.PasswordHash);
    }

    public static IEnumerable<UserDTO> FromModel(IEnumerable<User> users)
    {
        return users.Select(FromModel);
    }
}