import { SideBar } from "@/components/SideBar";
import User, { maskCPF } from "@/models/user.model";
import { decodeToken } from "@/services/auth.service";
import { getAllUsers, getRolesWhoCanEdit } from "@/services/user.service";
import { AArrowDown, IdCard, Mails, Menu, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type FilterOption = "name" | "cpf" | "email";

const UserPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUsers();
      setUsers(users);
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
    };

    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [navigate]);

  const totalUsers = users.length;

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const filterIcons: Record<FilterOption, React.JSX.Element> = {
    name: <AArrowDown size={24} />,
    cpf: <IdCard size={24} />,
    email: <Mails size={24} />,
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
                  onClick={() => navigate("/user/edit")}
                  disabled={!canEdit}
                >
                  + Usuário
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
                    <th className="px-4 py-3 border ">
                      Nome (Nome de Usuário)
                    </th>
                    <th className="px-4 py-3 border ">CPF</th>
                    <th className="px-4 py-3 border ">Email</th>
                    <th className="px-4 py-3 border ">Cargo</th>
                    <th className={canEdit ? `px-4 py-3 border` : `hidden`}>
                      Ações
                    </th>
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
                      <td className="border  px-4 py-3">
                        {user.displayName} <span>({user.userName})</span>
                      </td>
                      <td className="border  px-4 py-3">{maskCPF(user.cpf)}</td>
                      <td className="border  px-4 py-3">{user.email}</td>
                      <td className="border  px-4 py-3">{user.role}</td>
                      <td className={canEdit ? `border  px-4 py-3` : `hidden`}>
                        <button
                          onClick={() => navigate(`/user/edit/${user.id}`)}
                        >
                          <Pencil size={32} />
                        </button>
                        <button>
                          <Trash size={32} />
                        </button>
                      </td>
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
};

export default UserPage;
