namespace Users.API.Domain.Models;

public class User
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string UserName { get; private set; }
    public string DisplayName { get; private set; }
    public string Email { get; private set; }
    public string CPF { get; private set; }
    public string Role { get; private set; }
    public string PasswordHash { get; private set; }

    public User(Guid id, string userName, string displayName, string email, string cpf, string role, string passwordHash)
    {
        Id = id;
        UserName = userName.Trim().ToLower();

        if (UserName.Length == 11)
        {
            throw new ArgumentException("User name cannot be a CPF");
        }
        if (UserName.Contains('@'))
        {
            throw new ArgumentException("User name cannot be an email");
        }

        DisplayName = displayName.Trim();
        Email = email.Trim().ToLower();
        CPF = cpf;
        if (CPF.Length != 11)
        {
            throw new ArgumentException("CPF must have 11 characters");
        }
        Role = role;
        PasswordHash = passwordHash;
    }

    protected User() { }
}
