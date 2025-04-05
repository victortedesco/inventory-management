namespace Products.Infrastructure.DTO;

public class CategoryDTO : IDTO<int>
{
    public int Id { get; set; }
    public string Name { get; set; }
}
