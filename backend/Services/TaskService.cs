using AutoMapper;
using Backend.DTOs.Tasks;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class TaskService(ITaskRepository taskRepository, IMapper mapper, ILogger<TaskService> logger) : ITaskService
{
    public async Task<IReadOnlyCollection<TaskDto>> GetTasksAsync(string ownerEmail, CancellationToken cancellationToken = default)
    {
        var tasks = await taskRepository.GetByOwnerAsync(ownerEmail, cancellationToken);
        return mapper.Map<IReadOnlyCollection<TaskDto>>(tasks);
    }

    public async Task<TaskDto> GetTaskAsync(int id, string ownerEmail, CancellationToken cancellationToken = default)
    {
        var taskItem = await GetOwnedTaskAsync(id, ownerEmail, cancellationToken);
        return mapper.Map<TaskDto>(taskItem);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskRequestDto request, string ownerEmail, CancellationToken cancellationToken = default)
    {
        var taskItem = mapper.Map<TaskItem>(request);
        taskItem.OwnerEmail = ownerEmail;
        taskItem.CreatedAt = DateTime.UtcNow;
        taskItem.UpdatedAt = DateTime.UtcNow;

        await taskRepository.AddAsync(taskItem, cancellationToken);
        logger.LogInformation("Created task {TaskId} for {OwnerEmail}", taskItem.Id, ownerEmail);
        return mapper.Map<TaskDto>(taskItem);
    }

    public async Task<TaskDto> UpdateTaskAsync(int id, UpdateTaskRequestDto request, string ownerEmail, CancellationToken cancellationToken = default)
    {
        var taskItem = await GetOwnedTaskAsync(id, ownerEmail, cancellationToken);

        mapper.Map(request, taskItem);
        taskItem.UpdatedAt = DateTime.UtcNow;

        await taskRepository.UpdateAsync(taskItem, cancellationToken);
        logger.LogInformation("Updated task {TaskId} for {OwnerEmail}", taskItem.Id, ownerEmail);
        return mapper.Map<TaskDto>(taskItem);
    }

    public async Task DeleteTaskAsync(int id, string ownerEmail, CancellationToken cancellationToken = default)
    {
        var taskItem = await GetOwnedTaskAsync(id, ownerEmail, cancellationToken);
        await taskRepository.DeleteAsync(taskItem, cancellationToken);
        logger.LogInformation("Deleted task {TaskId} for {OwnerEmail}", taskItem.Id, ownerEmail);
    }

    private async Task<TaskItem> GetOwnedTaskAsync(int id, string ownerEmail, CancellationToken cancellationToken)
    {
        var taskItem = await taskRepository.GetByIdAsync(id, cancellationToken);
        if (taskItem is null || taskItem.OwnerEmail != ownerEmail)
        {
            throw new NotFoundException($"Task with id {id} was not found.");
        }

        return taskItem;
    }
}
