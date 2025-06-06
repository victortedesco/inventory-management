namespace Products.Domain.Models;

public class ProductInBox : IEntity<Guid>
{
    public uint Quantity { get; set; }

    public ProductInBox() { }
}
