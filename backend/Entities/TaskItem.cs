using System.ComponentModel.DataAnnotations;

namespace Backend.Entities;

public class TaskItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(20)]
    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }

    public bool IsCompleted { get; set; }

    [Required]
    [EmailAddress]
    public string OwnerEmail { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
