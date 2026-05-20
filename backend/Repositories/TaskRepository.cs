using Backend.Data;
using Backend.Entities;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class TaskRepository(AppDbContext dbContext) : ITaskRepository
{
    public Task<List<TaskItem>> GetByOwnerAsync(string ownerEmail, CancellationToken cancellationToken = default) =>
        dbContext.Tasks
            .Where(task => task.OwnerEmail == ownerEmail)
            .OrderBy(task => task.IsCompleted)
            .ThenBy(task => task.DueDate)
            .ThenBy(task => task.Title)
            .ToListAsync(cancellationToken);

    public Task<TaskItem?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        dbContext.Tasks.FirstOrDefaultAsync(task => task.Id == id, cancellationToken);

    public async Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        dbContext.Tasks.Add(taskItem);
        await dbContext.SaveChangesAsync(cancellationToken);
        return taskItem;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        dbContext.Tasks.Update(taskItem);
        await dbContext.SaveChangesAsync(cancellationToken);
        return taskItem;
    }

    public async Task DeleteAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        dbContext.Tasks.Remove(taskItem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
