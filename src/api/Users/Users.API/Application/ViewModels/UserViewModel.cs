using Users.API.Infrastructure.DTO;

namespace Users.API.Application.ViewModel;

public class UserViewModel
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string CPF { get; set; }
    public string Role { get; set; }

    public static UserViewModel FromDTO(UserDTO dto)
    {
        return new UserViewModel
        {
            Id = dto.Id,
            UserName = dto.UserName,
            DisplayName = dto.DisplayName,
            Email = dto.Email,
            CPF = dto.CPF,
            Role = dto.Role
        };
    }

    public static IEnumerable<UserViewModel> FromDTO(IEnumerable<UserDTO> dtos)
    {
        return dtos.Select(FromDTO);
    }
}