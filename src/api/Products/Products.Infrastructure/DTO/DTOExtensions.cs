using Products.Domain.Models;

namespace Products.Infrastructure.DTO;

public static class DTOExtensions
{
    public static ProductDTO ToDTO(this Product product)
    {
        return new ProductDTO(product.Id, product.Name, product.Image, product.UnitPrice, product.Category.Id);
    }

    public static IEnumerable<ProductDTO> ToDTO(this IEnumerable<Product> products)
    {
        return products.Select(ToDTO);
    }

    public static CategoryDTO ToDTO(this Category category)
    {
        return new CategoryDTO(category.Id, category.Name, category.Products.ToDTO());
    }

    public static IEnumerable<CategoryDTO> ToDTO(this IEnumerable<Category> categories)
    {
        return categories.Select(ToDTO);
    }
}
