namespace Products.API.ViewModels;

public class CategoryViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int TotalStock { get; set; }
    public int ProductCount { get; set; }
    public decimal Value { get; set; }
}
