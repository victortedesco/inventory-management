namespace Products.API.Requests.Products;

public class UpdateProductRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
}
