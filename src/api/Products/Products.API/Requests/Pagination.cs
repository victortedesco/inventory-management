namespace Products.API.Requests;

public class Pagination
{
    public int Skip { get; set; } = 0;
    public int Take { get; set; } = 10;
    public string Name { get; set; } = string.Empty;
}
