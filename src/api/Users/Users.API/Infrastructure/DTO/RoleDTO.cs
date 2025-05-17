using Users.API.Domain.Models;

namespace Users.API.Infrastructure.DTO;

public class RoleDTO
{
    public int Id { get; set; }
    public string Name { get; set; }

    public static RoleDTO FromModel(Role role)
    {
        return new RoleDTO
        {
            Id = role.Id,
            Name = role.Name
        };
    }

    public static IEnumerable<RoleDTO> FromModel(IEnumerable<Role> roles)
    {
        return roles.Select(FromModel);
    }
}
