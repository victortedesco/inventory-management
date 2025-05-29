namespace Products.API.ViewModels;

public class ProductViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public string Barcode { get; set; }
    public string ImageType => Image.StartsWith("data:") ? "Base64" : "URL";
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public CategoryViewModel Category { get; set; }
}
