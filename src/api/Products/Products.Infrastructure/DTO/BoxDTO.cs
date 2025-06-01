namespace Products.Infrastructure.DTO;

public class BoxDTO
{
    public Guid Id { get; set; }
    public string Barcode { get; set; }
    public string Name { get; set; }
    public decimal Discount { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
    public int ProductCount { get; set; }
    public int UniqueProductCount { get; set; }
}
