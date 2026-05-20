using Backend.DTOs.Tasks;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyCollection<TaskDto>>> GetAll(CancellationToken cancellationToken)
    {
        var ownerEmail = GetOwnerEmail();
        var tasks = await taskService.GetTasksAsync(ownerEmail, cancellationToken);
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<TaskDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var ownerEmail = GetOwnerEmail();
        var task = await taskService.GetTaskAsync(id, ownerEmail, cancellationToken);
        return Ok(task);
    }

    [HttpPost]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<TaskDto>> Create([FromBody] CreateTaskRequestDto request, CancellationToken cancellationToken)
    {
        var ownerEmail = GetOwnerEmail();
        var created = await taskService.CreateTaskAsync(request, ownerEmail, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<TaskDto>> Update(int id, [FromBody] UpdateTaskRequestDto request, CancellationToken cancellationToken)
    {
        var ownerEmail = GetOwnerEmail();
        var updated = await taskService.UpdateTaskAsync(id, request, ownerEmail, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var ownerEmail = GetOwnerEmail();
        await taskService.DeleteTaskAsync(id, ownerEmail, cancellationToken);
        return NoContent();
    }

    private string GetOwnerEmail()
    {
        if (!Request.Headers.TryGetValue("X-User-Email", out var values) || string.IsNullOrWhiteSpace(values.FirstOrDefault()))
        {
            throw new Backend.Exceptions.UnauthorizedException("Missing X-User-Email request header.");
        }

        return values.First()!;
    }
}
