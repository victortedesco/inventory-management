namespace Products.API.ViewModels;

public class BoxViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Discount { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
    public IEnumerable<ProductViewModel> Products { get; set; } = [];
}
