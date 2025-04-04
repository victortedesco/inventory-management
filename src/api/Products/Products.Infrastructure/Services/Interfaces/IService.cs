namespace Products.Infrastructure.Services.Interfaces;

public interface IService<ID, TDTO>
{
    Task<TDTO> GetByIdAsync(ID id);
    Task<IEnumerable<TDTO>> GetAllAsync(int skip, int take);
    Task<TDTO> CreateAsync(TDTO entity);
    Task<TDTO> UpdateAsync(TDTO entity);
    Task<bool> DeleteAsync(ID id);
}
