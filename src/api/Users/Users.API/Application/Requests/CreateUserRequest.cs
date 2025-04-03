namespace Users.API.Application.Requests;

public record CreateUserRequest(string UserName, string DisplayName, string Email, string CPF, string Password);
