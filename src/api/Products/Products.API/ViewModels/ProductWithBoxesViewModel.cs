namespace Products.API.ViewModels;

public class ProductWithBoxesViewModel
{
    public ProductViewModel Product { get; set; }
    public IEnumerable<BoxViewModel> Boxes { get; set; } = [];
}
