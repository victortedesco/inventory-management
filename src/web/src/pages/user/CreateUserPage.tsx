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
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

const CreateUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("id");

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const roles = await getRoles();
      setRoles(roles);

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
          cpf: formatCPF(user.cpf),
          email: user.email,
          password: "",
          role: user.role,
        });
      }

      var decodedToken = decodeToken(localStorage.getItem("token"));

      const canEdit = await getRolesWhoCanEdit();
      if (decodedToken && !canEdit.includes(decodedToken.role)) {
        toast.error("Você não tem permissão para acessar esta página.");
        navigate("/users");
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData().catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    id: userId,
    userName: "",
    displayName: "",
    cpf: "",
    email: "",
    password: "",
    role: "",
  });

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
    toast.info("Cadastrando usuário...");
    e.preventDefault();
    console.log(formData);
    toast.success("Usuário cadastrado.");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64 shrink-0">
        <SideBar isOpen={true} setIsOpen={setSidebarOpen} />
      </div>

      <div className="md:hidden">
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative">
        {/* Botão menu hamburguer no mobile */}
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>
        {/* Formulário de Cadastro de Produto */}
        <div className="flex justify-center items-start">
          <div className="bg-white p-8 rounded-xl shadow-lg w-80">
            <p className="text-center text-xl font-bold mb-4">
              {userId ? "Atualizar" : "Adicionar"} Usuário
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="id"
                placeholder={userId || "ID"}
                value={formData.id || ""}
                onChange={handleChange}
                className={
                  userId
                    ? `border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`
                    : `hidden`
                }
                disabled
              />

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

              {/* Dropdown menu */}
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
