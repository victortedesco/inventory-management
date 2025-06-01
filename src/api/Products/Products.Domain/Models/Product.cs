namespace Products.Domain.Models;

public class Product : IEntity<Guid>
{
    public string Name { get; set; }
    public string Image { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public string Barcode { get; set; }
    public Category Category { get; set; }
    public ICollection<ProductInBox> ProductInBoxes { get; set; } = [];

    public Product() { }
}
