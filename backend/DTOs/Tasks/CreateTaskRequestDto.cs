using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Tasks;

public class CreateTaskRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression("^(Low|Medium|High)$")]
    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }
}
