using Users.API.Infrastructure.DTO;
using Users.API.Infrastructure.Repositories;

namespace Users.API.Infrastructure.Services;

public interface IRoleService
{
    Task<IEnumerable<RoleDTO>> GetAllAsync();
    Task<RoleDTO> GetByIdAsync(int id);
    Task<RoleDTO> GetByNameAsync(string name);
}

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    private readonly IRoleRepository _roleRepository = roleRepository;

    public async Task<IEnumerable<RoleDTO>> GetAllAsync()
    {
        var roles = await _roleRepository.GetAllAsync();
        return RoleDTO.FromModel(roles);
    }

    public async Task<RoleDTO> GetByIdAsync(int id)
    {
        var role = await _roleRepository.GetByIdAsync(id);
        return RoleDTO.FromModel(role);
    }

    public async Task<RoleDTO> GetByNameAsync(string name)
    {
        var role = await _roleRepository.GetByNameAsync(name);
        return RoleDTO.FromModel(role);
    }
}
