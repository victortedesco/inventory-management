namespace Products.API.ViewModels;

public class ProductInBoxViewModel
{
    public Guid BoxId { get; set; }
    public Guid ProductId { get; set; }
    public uint Quantity { get; set; }

    public ProductViewModel Product { get; set; }
}
