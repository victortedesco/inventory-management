import { SideBar } from "@/components/SideBar";
import {
  AArrowDown,
  ExternalLink,
  GalleryHorizontalEnd,
  Menu,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getAllAuditLogs,
  getAuditLogByEntityType as getAuditLogsByEntityType,
  getAuditLogsByActionType,
  getAuditLogsByEntityName,
  getAuditLogsByUserId,
} from "@/services/audit-log.service";
import AuditLogHistory from "@/components/AuditLogHistory";
import { AuditLog } from "@/models/auditlog.model";

type FilterOption = "name" | "type" | "user" | "action";

const ListHistoryPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const auditLogs = await getAllAuditLogs();
      setAuditLogs(auditLogs);
      setLoading(false);
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [navigate]);

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const handleSearch = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      const auditLogs = await getAllAuditLogs();
      setAuditLogs(auditLogs);
      return;
    }
    switch (selectedFilter) {
      case "name":
        const auditLogsByName = await getAuditLogsByEntityName(searchQuery);
        setAuditLogs(auditLogsByName);
        break;
      case "type": {
        let convertedSearch = "";
        if ("caixa".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Box";
        } else if ("categoria".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Category";
        } else if ("produto".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Product";
        } else {
          return;
        }
        const auditLogsByType = await getAuditLogsByEntityType(
          convertedSearch as "Box" | "Category" | "Product"
        );
        setAuditLogs(auditLogsByType);
        break;
      }
      case "user":
        const auditLogsByUser = await getAuditLogsByUserId(searchQuery);
        setAuditLogs(auditLogsByUser);
        break;
      case "action": {
        let convertedSearch = "";
        if ("exclusão".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Delete";
        } else if ("atualização".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Update";
        } else if ("adição".startsWith(searchQuery.toLowerCase())) {
          convertedSearch = "Create";
        } else {
          return;
        }
        const auditLogsByAction = await getAuditLogsByActionType(
          convertedSearch as "Create" | "Update" | "Delete"
        );
        setAuditLogs(auditLogsByAction);
        break;
      }
    }
  };

  const filterIcons: Record<FilterOption, React.JSX.Element> = {
    name: <AArrowDown size={24} />,
    type: <GalleryHorizontalEnd size={24} />,
    user: <User size={24} />,
    action: <ExternalLink size={24} />,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 shrink-0 hidden md:block h-full">
        <SideBar isOpen={true} setIsOpen={setSidebarOpen} />
      </div>

      <div className="md:hidden fixed z-50">
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 relative">
        {/* Botão menu hamburguer no mobile */}
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>

        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              {/* Formulário superior */}
              <form className="flex gap-2 w-full sm:max-w-md md:max-w-screen bg-white text-black border border-[--color-color-3] p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Pesquisar por..."
                  className="border p-1.5 rounded text-base md:w-full sm:w-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                          onClick={() => handleFilterSelect("type")}
                        >
                          Tipo
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("user")}
                        >
                          Usuário
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("action")}
                        >
                          Ação
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSearch}
                  type="submit"
                  className="border p-1.5 w-auto rounded text-base"
                >
                  Enviar
                </button>
              </form>
            </div>
            <AuditLogHistory
              isSpecific={false}
              logs={auditLogs}
            ></AuditLogHistory>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ListHistoryPage;
