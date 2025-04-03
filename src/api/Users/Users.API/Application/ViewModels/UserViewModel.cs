using Users.API.Infrastructure.DTO;

namespace Users.API.Application.ViewModels;

public record UserViewModel(Guid Id, string UserName, string DisplayName, string Email, string CPF, string Role)
{
    public static UserViewModel FromDTO(UserDTO dto)
    {
        return new UserViewModel(dto.Id, dto.UserName, dto.DisplayName, dto.Email, dto.CPF, dto.Role);
    }

    public static IEnumerable<UserViewModel> FromDTO(IEnumerable<UserDTO> dtos)
    {
        return dtos.Select(FromDTO);
    }
}