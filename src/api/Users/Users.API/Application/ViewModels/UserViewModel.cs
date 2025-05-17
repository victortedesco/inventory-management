using Users.API.Infrastructure.DTO;

namespace Users.API.Application.ViewModels;

public record UserViewModel(Guid Id, string UserName, string DisplayName, string Email, string CPF, string Role)
{
    public static UserViewModel FromDTO(UserDTO dto)
    {
        return new UserViewModel(dto.Id, dto.UserName, dto.DisplayName, dto.Email, MaskCPF(dto.CPF), dto.Role);
    }

    public static IEnumerable<UserViewModel> FromDTO(IEnumerable<UserDTO> dtos)
    {
        return dtos.Select(FromDTO);
    }

    private static string MaskCPF(string cpf)
    {
        if (cpf.Length != 11)
            return cpf;

        var chars = cpf.ToCharArray();

        for (int i = 3; i <= 8; i++)
        {
            chars[i] = '*';
        }

        return new string(chars);
    }
}
