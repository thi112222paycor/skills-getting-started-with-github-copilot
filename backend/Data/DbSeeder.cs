using System.Security.Cryptography;
using System.Text;
using Backend.Entities;

namespace Backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new AppUser
                {
                    Name = "Demo Student",
                    Email = "student@mergington.edu",
                    PasswordHash = HashPassword("Pass123!"),
                    CreatedAt = DateTime.UtcNow
                },
                new AppUser
                {
                    Name = "Team Lead",
                    Email = "lead@mergington.edu",
                    PasswordHash = HashPassword("Pass123!"),
                    CreatedAt = DateTime.UtcNow
                });
        }

        if (!context.Tasks.Any())
        {
            context.Tasks.AddRange(
                new TaskItem
                {
                    Title = "Prepare sprint board",
                    Description = "Review this week's priorities and confirm owners.",
                    Priority = "High",
                    DueDate = DateTime.UtcNow.Date.AddDays(2),
                    IsCompleted = false,
                    OwnerEmail = "student@mergington.edu",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TaskItem
                {
                    Title = "Update dashboard notes",
                    Description = "Capture progress for the project dashboard.",
                    Priority = "Medium",
                    DueDate = DateTime.UtcNow.Date.AddDays(4),
                    IsCompleted = true,
                    OwnerEmail = "student@mergington.edu",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new TaskItem
                {
                    Title = "Plan demo script",
                    Description = "Draft the talking points for the stakeholder demo.",
                    Priority = "Low",
                    DueDate = DateTime.UtcNow.Date.AddDays(7),
                    IsCompleted = false,
                    OwnerEmail = "lead@mergington.edu",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
        }

        context.SaveChanges();
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }
}
