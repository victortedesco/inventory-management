namespace Products.Domain.Models;

public class Box : IEntity<Guid>
{
    public string BarCode { get; set; }
    public string Name { get; set; }
    public uint Stock { get; set; }
    public decimal Discount { get; set; }
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
    public ICollection<ProductInBox> Products { get; set; } = new List<ProductInBox>();

    public Box() { }
}
