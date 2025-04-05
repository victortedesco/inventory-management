using FluentResults;
using Users.API.Domain.Models;
using Users.API.Infrastructure.DTO;
using Users.API.Infrastructure.Repositories;

namespace Users.API.Infrastructure.Services;

public interface IUserService
{
    Task<IEnumerable<UserDTO>> GetAllAsync();
    Task<UserDTO> GetByIdAsync(Guid id);
    Task<UserDTO> GetByUserNameAsync(string userName);
    Task<UserDTO> GetByEmailAsync(string email);
    Task<UserDTO> GetByCPFAsync(string cpf);
    Task<IEnumerable<UserDTO>> GetByDisplayNameAsync(string displayName);
    Task<Result<UserDTO>> CreateAsync(UserDTO user);
    Task<Result<UserDTO>> UpdateAsync(UserDTO user);
    Task<bool> DeleteAsync(Guid id);
}

public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;

    public async Task<IEnumerable<UserDTO>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return UserDTO.FromModel(users);
    }

    public async Task<UserDTO> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user is null ? null : UserDTO.FromModel(user);
    }

    public async Task<UserDTO> GetByUserNameAsync(string userName)
    {
        var user = await _userRepository.GetByUserNameAsync(userName.ToLower());
        return user is null ? null : UserDTO.FromModel(user);
    }

    public async Task<UserDTO> GetByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email.ToLower());
        return user is null ? null : UserDTO.FromModel(user);
    }

    public async Task<UserDTO> GetByCPFAsync(string cpf)
    {
        var user = await _userRepository.GetByCPFAsync(cpf);
        return user is null ? null : UserDTO.FromModel(user);
    }

    public async Task<IEnumerable<UserDTO>> GetByDisplayNameAsync(string displayName)
    {
        var users = await _userRepository.GetByDisplayNameAsync(displayName);
        return UserDTO.FromModel(users);
    }

    public async Task<Result<UserDTO>> CreateAsync(UserDTO user)
    {
        var errors = new List<Error>();

        if (await _userRepository.GetByUserNameAsync(user.UserName) is not null)
        {
            errors.Add(new Error("User name already exists"));
        }
        if (await _userRepository.GetByCPFAsync(user.CPF) is not null)
        {
            errors.Add(new Error("CPF already exists"));
        }
        if (await _userRepository.GetByEmailAsync(user.Email) is not null)
        {
            errors.Add(new Error("Email already exists"));
        }
        if (!user.Email.Contains('@') && !user.Email.Contains('.'))
        {
            errors.Add(new Error("Invalid email"));
        }
        if (user.UserName.Contains('@'))
        {
            errors.Add(new Error("User name cannot contain '@'"));
        }
        if (user.UserName.Contains('.'))
        {
            errors.Add(new Error("User name cannot contain '.'"));
        }
        if (user.UserName.Length == 11 && user.UserName.All(char.IsDigit))
        {
            errors.Add(new Error("User name cannot be a CPF"));
        }
        if (user.CPF.Length != 11)
        {
            errors.Add(new Error("CPF must have 11 characters"));
        }
        if (!user.CPF.All(char.IsDigit))
        {
            errors.Add(new Error("CPF must contain only numbers"));
        }
        if (errors.Count > 0)
        {
            return Result.Fail(errors);
        }

        user.Password = _passwordHasher.HashPassword(user.Password);
        var newUser = new User(Guid.NewGuid(), user.UserName, user.DisplayName, user.Email, user.CPF, user.Role, user.Password);

        var result = await _userRepository.CreateAsync(newUser);

        if (result is null)
            return Result.Fail("Failed to create user");

        return Result.Ok(UserDTO.FromModel(result));
    }

    public async Task<Result<UserDTO>> UpdateAsync(UserDTO user)
    {
        var errors = new List<Error>();
        var existingUser = await _userRepository.GetByIdAsync(user.Id);

        if (existingUser is null)
        {
            return Result.Fail("User not found");
        }
        if (await _userRepository.GetByCPFAsync(user.CPF) is not null && existingUser.CPF != user.CPF)
        {
            errors.Add(new Error("CPF already exists"));
        }
        if (await _userRepository.GetByUserNameAsync(user.UserName) is not null && existingUser.UserName != user.UserName.ToLower().Trim())
        {
            errors.Add(new Error("User name already exists"));
        }
        if (await _userRepository.GetByEmailAsync(user.Email) is not null && existingUser.Email != user.Email.ToLower().Trim())
        {
            errors.Add(new Error("Email already exists"));
        }
        if (!user.Email.Contains('@') && !user.Email.Contains('.'))
        {
            errors.Add(new Error("Invalid email"));
        }
        if (user.UserName.Contains('@'))
        {
            errors.Add(new Error("User name cannot contain '@'"));
        }
        if (user.UserName.Contains('.'))
        {
            errors.Add(new Error("User name cannot contain '.'"));
        }
        if (user.UserName.Length == 11 && user.UserName.All(char.IsDigit))
        {
            errors.Add(new Error("User name cannot be a CPF"));
        }
        if (user.CPF.Length != 11)
        {
            errors.Add(new Error("CPF must have 11 characters"));
        }
        if (!user.CPF.All(char.IsDigit))
        {
            errors.Add(new Error("CPF must contain only numbers"));
        }
        if (errors.Count > 0)
        {
            return Result.Fail(errors);
        }

        user.Password = _passwordHasher.HashPassword(user.Password);
        var updatedUser = new User(user.Id, user.UserName, user.DisplayName, user.Email, user.CPF, user.Role, user.Password);

        var result = await _userRepository.UpdateAsync(updatedUser);

        if (result is null)
            return Result.Fail("Failed to update user");

        return Result.Ok(UserDTO.FromModel(result));
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _userRepository.DeleteAsync(id);
    }
}
