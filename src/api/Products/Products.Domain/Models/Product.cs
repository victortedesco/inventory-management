namespace Products.Domain.Models;

public class Product : IEntity<Guid>
{
    public string Name { get; set; }
    public string Image { get; set; }
    public decimal UnitPrice { get; set; }
    public uint Stock { get; set; }
    public uint GetTotalStock()
    {
        uint inBoxes = (uint)this.ProductInBoxes.Sum(pib => pib.Quantity);

        return this.Stock + inBoxes;
    }
    public string BarCode { get; set; }
    public Category Category { get; set; }
    public ICollection<ProductInBox> ProductInBoxes { get; set; } = new List<ProductInBox>();

    public Product() { }
}
