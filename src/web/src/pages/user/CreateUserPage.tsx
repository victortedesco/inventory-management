import { SideBar } from "@/components/SideBar";
import User, { formatCPF } from "@/models/user.model";
import { decodeToken } from "@/services/auth.service";
import {
  getRoles,
  getRolesWhoCanEdit,
  getUserById,
} from "@/services/user.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    displayName: "",
    cpf: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    setUserId(id || null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = decodeToken(token);
      const canEditRoles = await getRolesWhoCanEdit();

      if (!decodedToken || !canEditRoles.includes(decodedToken.role)) {
        toast.error("Você não tem permissão para acessar esta página.");
        navigate("/users");
        return;
      }

      const allRoles = await getRoles();
      setRoles(allRoles);

      if (userId) {
        const user = await getUserById(userId);
        if (!user) {
          toast.error("Usuário não encontrado.");
          navigate("/users");
          return;
        }

        setUser(user);
        setFormData({
          id: user.id,
          userName: user.userName,
          displayName: user.displayName,
          cpf: user.cpf,
          email: user.email,
          password: "",
          role: user.role,
        });
      }

      setLoading(false);
    };

    // Só executa após `userId` estar definido (inclusive se for null)
    if (userId !== undefined) {
      fetchData().catch(console.error);
    }
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "cpf") {
      newValue = formatCPF(value);
      setFormData({ ...formData, [name]: newValue.replace(/\D/g, "") });
      return;
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Cadastrando usuário...");
    console.log(formData);
    toast.success("Usuário cadastrado.");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64 shrink-0">
        <SideBar isOpen={true} setIsOpen={setSidebarOpen} />
      </div>

      <div className="md:hidden">
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative">
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>

        <div className="flex justify-center items-start">
          <div className="bg-white p-8 rounded-xl shadow-lg w-80">
            <p className="text-center text-xl font-bold mb-4">
              {userId ? "Atualizar" : "Adicionar"} Usuário
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {userId && (
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={formData.id}
                  disabled
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}

              <input
                type="text"
                name="displayName"
                placeholder="Nome de Exibição"
                value={formData.displayName}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="text"
                name="userName"
                placeholder="Nome de Usuário"
                value={formData.userName}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Selecione o cargo
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
