﻿using Products.Domain.Models;

namespace Products.Domain.Repositories;

public interface IRepository<ID, TEntity> where TEntity : IEntity<ID>
{
    Task<TEntity> GetByIdAsync(ID id);
    Task<IEnumerable<TEntity>> GetAllAsync(int skip, int take, string name);
    Task<TEntity> CreateAsync(TEntity entity);
    Task<TEntity> UpdateAsync(TEntity entity);
    Task<bool> DeleteAsync(ID id);
}
