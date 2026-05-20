using Backend.Entities;

namespace Backend.Repositories.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<AppUser> AddAsync(AppUser user, CancellationToken cancellationToken = default);
}
