using Products.Domain.Models;

namespace Products.Infrastructure.DTO;

public static class DTOExtensions
{
    public static ProductDTO ToDTO(this Product product)
    {
        return new ProductDTO
        {
            Id = product.Id,
            Name = product.Name,
            Image = product.Image,
            UnitPrice = product.UnitPrice,
            Quantity = product.Quantity,
            Category = product.Category.ToDTO()
        };
    }

    public static IEnumerable<ProductDTO> ToDTO(this IEnumerable<Product> products)
    {
        return products.Select(ToDTO);
    }

    public static CategoryDTO ToDTO(this Category category)
    {
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name
        };
    }

    public static IEnumerable<CategoryDTO> ToDTO(this IEnumerable<Category> categories)
    {
        return categories.Select(ToDTO);
    }
}
