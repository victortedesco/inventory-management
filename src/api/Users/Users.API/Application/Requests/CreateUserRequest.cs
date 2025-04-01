namespace Users.API.Application.Requests;

public class CreateUserRequest
{
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string CPF { get; set; }
    public string Password { get; set; }
}
