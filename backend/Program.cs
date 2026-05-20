using AutoMapper;
using Backend.Data;
using Backend.Middleware;
using Backend.Profiles;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Swap UseInMemoryDatabase for UseSqlServer and move the connection string to configuration
    // when you are ready to connect this application to a real SQL Server instance.
    options.UseInMemoryDatabase("TaskManagerDb");
});

builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? ["http://localhost:5173", "http://127.0.0.1:5173"];

    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddSingleton<IMapper>(_ =>
{
    var configuration = new MapperConfiguration(
        config => config.AddMaps(typeof(MappingProfile).Assembly),
        _.GetRequiredService<ILoggerFactory>());
    return configuration.CreateMapper();
});
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("Frontend");
app.UseHttpsRedirection();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(dbContext);
}

app.Run();
