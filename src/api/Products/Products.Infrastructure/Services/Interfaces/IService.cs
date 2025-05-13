using FluentResults;

namespace Products.Infrastructure.Services.Interfaces;

public interface IService<ID, TDTO>
{
    Task<TDTO> GetByIdAsync(ID id);
    Task<IEnumerable<TDTO>> GetAllAsync(int skip, int take, string name);
    Task<Result<TDTO>> CreateAsync(Guid createdBy, TDTO entity);
    Task<Result<TDTO>> UpdateAsync(Guid updatedBy, TDTO entity);
    Task<bool> DeleteAsync(ID id);
}
