namespace Products.API.Requests.Products;

public class CreateProductRequest
{
    public string Name { get; set; }
    public string Image { get; set; }
    public string Barcode { get; set; }
    public string CategoryId { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
}
