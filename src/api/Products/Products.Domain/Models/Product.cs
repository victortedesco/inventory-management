namespace Products.Domain.Models;

public class Product : IEntity<Guid>
{
    public string Image { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public Category Category { get; set; }

    public Product() { }
}

public enum ImageType
{
    Base64,
    URL
}