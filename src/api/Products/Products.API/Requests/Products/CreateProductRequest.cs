namespace Products.API.Requests.Products;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
}
