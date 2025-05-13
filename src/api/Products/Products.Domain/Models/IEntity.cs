namespace Products.Domain.Models;

public abstract class IEntity<ID> where ID : notnull
{
    public ID Id { get; init; }
    public string Name { get; set; }
    public Guid CreatedBy { get; init; }
    public Guid UpdatedBy { get; set; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
}
