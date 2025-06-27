using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Polly;
using Products.API;
using Products.Infrastructure;
using Products.Infrastructure.Data;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    options.SuppressMapClientErrors = true;
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
    };
});
builder.Services.AddSwaggerGen(c =>
{
    c.SchemaFilter<DateOnlySchemaFilter>();

    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Inventory Management - Product API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Authenticate using the Bearer scheme.\r\n\r\n" +
              "Enter 'Bearer' followed by a space and then your token in the field below.\r\n\r\n" +
              "Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                    },
                    []
                }
            });
});

builder.Services.AddSwaggerGen();

var password = builder.Environment.IsProduction() ? Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") : "Development";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection").Replace("${POSTGRES_PASSWORD}", password);

if (builder.Environment.IsProduction())
{
    connectionString = connectionString.Replace("localhost", "postgres");
}
builder.Services.AddHttpContextAccessor();
builder.Services.AddInfrastructure(connectionString);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseCors();

app.MapControllers();

_ = Task.Run(() => ExecuteMigrationsPeriodically(app));

app.Run();

static async Task ExecuteMigrationsPeriodically(WebApplication app)
{
    await Task.Delay(TimeSpan.FromSeconds(5));

    var retryPolicy = Policy
        .Handle<Exception>()
        .WaitAndRetryForeverAsync(retryAttempt =>
        {
            return TimeSpan.FromSeconds(5);
        });

    await retryPolicy.ExecuteAsync(async () =>
    {
        using var scope = app.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            await dbContext.Database.MigrateAsync();
        }
    });
}