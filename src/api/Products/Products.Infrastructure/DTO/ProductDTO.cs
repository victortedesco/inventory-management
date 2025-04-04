namespace Products.Infrastructure.DTO;

public record ProductDTO(Guid Id, string Name, string Image, decimal UnitPrice, CategoryDTO Category) : IDTO<Guid>;
