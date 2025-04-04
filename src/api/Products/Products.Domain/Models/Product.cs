namespace Products.Domain.Models;

public class Product : IEntity<Guid>
{
    public string Image { get; set; }
    public ImageType ImageType => Image.StartsWith("data:") ? ImageType.Base64 : ImageType.URL;
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public Category Category { get; set; }
}

public enum ImageType
{
    Base64,
    URL
}