using AutoMapper;
using Backend.DTOs.Tasks;
using Backend.Entities;

namespace Backend.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TaskItem, TaskDto>();
        CreateMap<CreateTaskRequestDto, TaskItem>();
        CreateMap<UpdateTaskRequestDto, TaskItem>();
    }
}
