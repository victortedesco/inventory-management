namespace Products.Infrastructure.DTO;

public class ProductInBoxDTO
{
    public Guid BoxId { get; set; }
    public ProductDTO Product { get; set; }
    public uint Quantity { get; set; }
}
