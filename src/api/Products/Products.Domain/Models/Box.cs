namespace Products.Domain.Models;

public class Box : IEntity<Guid>
{
    public uint Quantity { get; set; }
    public decimal Discount { get; set; }
    public ICollection<Product> Products { get; set; } = [];
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
}
