namespace Products.Domain.Models;

public class ProductInBox : IEntity<Guid>
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; }

    public Guid BoxId { get; set; }
    public Box Box { get; set; }

    public uint Quantity { get; set; }

    public ProductInBox() { }
}
