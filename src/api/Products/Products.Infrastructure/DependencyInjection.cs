using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Products.Domain.Repositories;
using Products.Infrastructure.Data;
using Products.Infrastructure.Repositories;
using Products.Infrastructure.Services;
using Products.Infrastructure.Services.Interfaces;

namespace Products.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>(options =>
        {

            options.UseNpgsql(connectionString);
        });
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        //services.AddScoped<IBoxRepository, BoxRepository>();
        services.AddScoped<ICategoryService, CategoryService>();
        return services;
    }
}
