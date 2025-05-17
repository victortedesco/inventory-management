using Users.API.Domain.Kernel;

namespace Users.API.Domain.Models;

public class Role(int id, string name) : Enumeration(id, name)
{
    public static Role Developer = new(1, "Desenvolvedor");
    public static Role Manager = new(2, "Gerente");
    public static Role Administrator = new(3, "Administrador");
    public static Role Auxiliary = new(4, "Auxiliar");
    public static Role Support = new(5, "Suporte");
}
