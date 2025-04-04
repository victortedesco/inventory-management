namespace Products.Infrastructure.DTO;

public record CategoryDTO(int Id, string Name, IEnumerable<ProductDTO> Products) : IDTO<int>;
