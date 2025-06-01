namespace Products.API.Requests.Boxes;

public class CreateBoxRequest
{
    public string Barcode { get; set; }
    public string Name { get; set; }
    public decimal Discount { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public float Weight { get; set; }
    public float Depth { get; set; }
    public float Height { get; set; }
    public float Width { get; set; }
}
