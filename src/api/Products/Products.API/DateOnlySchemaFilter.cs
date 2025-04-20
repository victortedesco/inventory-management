using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Products.API;

public class DateOnlySchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(DateOnly))
        {
            schema.Type = "string";
            schema.Format = "date";
            schema.Example = new OpenApiString("2025-04-19");
        }
    }
}