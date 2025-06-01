namespace Products.Domain.Models;

public abstract class IEntity<ID> where ID : notnull
{
    public ID Id { get; init; }
}
