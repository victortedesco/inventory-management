namespace Products.Domain.Models;

public class Box : IEntity<Guid>
{
    public string Barcode { get; set; }
    public string Name { get; set; }
    public uint Quantity { get; set; }
    public decimal Discount { get; set; }
    public ICollection<ProductInBox> Products { get; set; } = [];
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }

    public Box() { }
}
