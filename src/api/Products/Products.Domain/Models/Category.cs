namespace Products.Domain.Models;

public class Category : IEntity<int>
{
    public ICollection<Product> Products { get; set; } = [];

    public Category() { }
}
