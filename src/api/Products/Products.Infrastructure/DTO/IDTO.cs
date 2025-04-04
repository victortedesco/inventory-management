namespace Products.Infrastructure.DTO;

public interface IDTO<T>
{
    T Id { get; }
    string Name { get; }
}
