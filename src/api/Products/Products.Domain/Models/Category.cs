namespace Products.Domain.Models;

public class Category : IEntity<Guid>
{
    public string Name { get; set; }
    public ICollection<Product> Products { get; set; } = [];

    public Category() { }
}
