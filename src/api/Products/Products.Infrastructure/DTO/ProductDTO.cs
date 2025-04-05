namespace Products.Infrastructure.DTO;

public record ProductDTO(Guid Id, string Name, string Image, decimal UnitPrice, uint Quantity, int CategoryId) : IDTO<Guid>;
