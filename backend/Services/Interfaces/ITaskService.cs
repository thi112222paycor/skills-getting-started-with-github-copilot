using Backend.DTOs.Tasks;

namespace Backend.Services.Interfaces;

public interface ITaskService
{
    Task<IReadOnlyCollection<TaskDto>> GetTasksAsync(string ownerEmail, CancellationToken cancellationToken = default);
    Task<TaskDto> GetTaskAsync(int id, string ownerEmail, CancellationToken cancellationToken = default);
    Task<TaskDto> CreateTaskAsync(CreateTaskRequestDto request, string ownerEmail, CancellationToken cancellationToken = default);
    Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskRequestDto request, string ownerEmail, CancellationToken cancellationToken = default);
    Task DeleteTaskAsync(int id, string ownerEmail, CancellationToken cancellationToken = default);
}
