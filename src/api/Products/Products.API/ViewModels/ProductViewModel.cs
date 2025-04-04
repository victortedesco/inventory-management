using Products.Domain.Models;

namespace Products.API.ViewModels;

public class ProductViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public ImageType ImageType => Image.StartsWith("data:") ? ImageType.Base64 : ImageType.URL;
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public int CategoryId { get; set; }
}
