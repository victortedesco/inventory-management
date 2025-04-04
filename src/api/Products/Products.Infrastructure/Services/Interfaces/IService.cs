using FluentResults;

namespace Products.Infrastructure.Services.Interfaces;

public interface IService<ID, TDTO>
{
    Task<TDTO> GetByIdAsync(ID id);
    Task<IEnumerable<TDTO>> GetAllAsync(int skip, int take);
    Task<Result> CreateAsync(Guid createdBy, TDTO entity);
    Task<Result> UpdateAsync(Guid updatedBy, TDTO entity);
    Task<bool> DeleteAsync(ID id);
}
