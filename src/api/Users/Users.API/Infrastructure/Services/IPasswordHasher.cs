namespace Users.API.Infrastructure.Services;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyHashedPassword(string hashedPassword, string password);
}

public class PasswordHasher : IPasswordHasher
{
    private readonly string _salt = BCrypt.Net.BCrypt.GenerateSalt(12);

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, _salt);
    }

    public bool VerifyHashedPassword(string hashedPassword, string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
