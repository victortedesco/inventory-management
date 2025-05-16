import { SideBar } from "@/components/SideBar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function CreateUserPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const [formData, setFormData] = useState({
    userName: "",
    displayName: "",
    cpf: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: value.replace(",", ".") });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Cadastrou o usuário 👍");
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
              Adicionar Usuário
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <input
                type="text"
                name="role"
                placeholder="Cargo"
                value={formData.role}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

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
}

export default CreateUserPage;
