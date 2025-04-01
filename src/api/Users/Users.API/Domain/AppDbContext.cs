using Microsoft.EntityFrameworkCore;
using Users.API.Domain.Models;

namespace Users.API.Domain;

public class AppDbContext(DbContextOptions<AppDbContext> ops) : DbContext(ops)
{
    public DbSet<User> Users { get; set; }
}
