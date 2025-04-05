namespace Products.Infrastructure.DTO;

public class ProductDTO : IDTO<Guid>
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Image { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Quantity { get; set; }
    public CategoryDTO Category { get; set; }
}
