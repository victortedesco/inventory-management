namespace Users.API.Application.Requests;

public record UpdateUserRequest(string UserName, string DisplayName, string Email, string CPF, string Password);
