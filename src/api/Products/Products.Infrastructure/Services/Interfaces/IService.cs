using FluentResults;

namespace Products.Infrastructure.Services.Interfaces;

public interface IService<ID, TDTO>
{
    Task<TDTO> GetByIdAsync(ID id);
    Task<TDTO> GetByName(string name);
    Task<IEnumerable<TDTO>> GetAllAsync(int skip, int take);
    Task<Result<TDTO>> CreateAsync(Guid createdBy, TDTO entity);
    Task<Result<TDTO>> UpdateAsync(Guid updatedBy, TDTO entity);
    Task<bool> DeleteAsync(ID id);
}
