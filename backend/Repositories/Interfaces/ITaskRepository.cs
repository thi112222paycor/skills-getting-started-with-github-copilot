using Backend.Entities;

namespace Backend.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetByOwnerAsync(string ownerEmail, CancellationToken cancellationToken = default);
    Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task DeleteAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
}
