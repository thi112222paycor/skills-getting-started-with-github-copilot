using System.Security.Cryptography;
using System.Text;
using Backend.DTOs.Auth;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class AuthService(IUserRepository userRepository, ILogger<AuthService> logger) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);
        if (existingUser is not null)
        {
            throw new ConflictException("A user with this email already exists.");
        }

        var user = new AppUser
        {
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            PasswordHash = HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        await userRepository.AddAsync(user, cancellationToken);
        logger.LogInformation("Registered mock user {Email}", user.Email);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail, cancellationToken);

        if (user is null || user.PasswordHash != HashPassword(request.Password))
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        logger.LogInformation("Mock user {Email} logged in", user.Email);
        return CreateAuthResponse(user);
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }

    private static AuthResponseDto CreateAuthResponse(AppUser user) => new()
    {
        Name = user.Name,
        Email = user.Email,
        Token = Convert.ToBase64String(Guid.NewGuid().ToByteArray())
    };
}
