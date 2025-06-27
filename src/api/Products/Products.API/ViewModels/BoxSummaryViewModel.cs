namespace Products.API.ViewModels;

public class BoxSummaryViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Barcode { get; set; }
    public uint QuantityInBox { get; set; }
}
