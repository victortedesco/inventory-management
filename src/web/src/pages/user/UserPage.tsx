import { SideBar } from "@/components/SideBar";
import User, { formatCPF } from "@/models/user.model";
import { getAllUsers } from "@/services/user.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type FilterOption = "name" | "cpf" | "email";

function UserPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, []);

  const totalUsers = users.length;

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const filterIcons: Record<FilterOption, string> = {
    name: "🔤", // Nome do usuario
    cpf: "📕", // CPF
    email: "📩", // Email
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
      <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative overflow-auto">
        {/* Botão menu hamburguer no mobile */}
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>

        {/* Produtos fofos */}

        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <h2 className="text-2xl md:text-lg font-semibold">Usuários</h2>
                <p className="text-base md:text-sm">
                  {totalUsers} usuários cadastrados
                </p>
              </div>

              {/* Formulário superior */}
              <form className="flex flex-nowrap sm:justify-end gap-2 w-full sm:max-w-md max-w-xs bg-white text-black border border-[--color-color-3] p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Pesquisar por..."
                  className="border p-1.5 rounded text-base w-full sm:w-40"
                />
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="border p-1.5 rounded text-base"
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                  >
                    {filterIcons[selectedFilter]}
                  </button>

                  {showFilterOptions && (
                    <div className="absolute top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow z-10">
                      <p className="px-3 py-2 font-semibold border-b">
                        Pesquisar por:
                      </p>
                      <ul className="flex flex-col">
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("name")}
                        >
                          Nome
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("cpf")}
                        >
                          CPF
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("email")}
                        >
                          Email
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="border p-1.5 rounded text-base"
                  onClick={() => navigate("/create-user")}
                >
                  + Usuários
                </button>
                <button
                  type="submit"
                  className="border p-1.5 rounded text-base"
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* Formulário inferior (tabela) */}
            <form className="overflow-x-auto">
              <table className="min-w-full bg-white border text-lg md:text-base">
                <thead className="bg-color-3 text-black">
                  <tr>
                    <th className="w-10 px-4 py-3 border ">⭐</th>
                    <th className="px-4 py-3 border ">Nome</th>
                    <th className="px-4 py-3 border ">CPF</th>
                    <th className="px-4 py-3 border ">Email</th>
                    <th className="px-4 py-3 border ">🗑️</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className={`text-center ${
                        index % 2 === 0 ? "bg-color-1" : "bg-color-2"
                      }`}
                    >
                      <td className="border px-4 py-3">
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                      <td className="border  px-4 py-3">
                        {user.displayName} <span>({user.userName})</span>
                      </td>
                      <td className="border  px-4 py-3">
                        {formatCPF(user.cpf)}
                      </td>
                      <td className="border  px-4 py-3">{user.email}</td>
                      <td className="border  px-4 py-3">🗑️</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
