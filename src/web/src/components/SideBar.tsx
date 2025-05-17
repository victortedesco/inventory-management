import { useEffect, useState } from "react";
import {
  BookUser,
  Boxes,
  Forklift,
  GalleryHorizontalEnd,
  History,
  PackageSearch,
  X,
} from "lucide-react";
import User, { maskCPF } from "@/models/user.model";
import { decodeToken, logout } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { useNavigate } from "react-router";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async (id: string) => {
      const data = await getUserById(id);
      if (!data) {
        localStorage.removeItem("token");
        logout();
        return;
      }

      setUser(data);
    };

    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      logout();
      return;
    }

    fetchUser(decodedToken.sub);
  }, []);

  const navItems = [
    { icon: <Forklift size={32} />, label: "Movimentação", route: "/move" },
    {
      icon: <PackageSearch size={32} />,
      label: "Produtos",
      route: "/products",
    },
    {
      icon: <GalleryHorizontalEnd size={32} />,
      label: "Categorias",
      route: "/categories",
    },
    { icon: <Boxes size={32} />, label: "Caixas", route: "/boxes" },
    { icon: <BookUser size={32} />, label: "Usuários", route: "/users" },
    { icon: <History size={32} />, label: "Histórico", route: "/history" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 left-0 z-50 h-full w-full bg-white text-gray-800 flex flex-col p-4 shadow-lg
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static
  `}
      >
        {/* Mobile close button */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-800">Painel</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* Usuário */}
        <div className="flex items-center mb-8">
          <img
            className="w-12 h-12 rounded-full"
            src="/user-icon.png"
            alt="Usuário"
          />
          <div className="ml-4">
            <h1 className="font-bold text-gray-900">
              {user?.displayName ?? "Carregando..."}
            </h1>
            <p className="text-sm text-gray-600">
              {maskCPF(user?.cpf) ?? "CPF Não Cadastrado"}
            </p>
            <p className="text-sm text-gray-600">{user?.role ?? "Usuário"}</p>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-3 font-medium">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                navigate(item.route);
                setIsOpen(false);
              }}
              className="flex cursor-pointer items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <span className="flex-shrink-0 text-color-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Botão de sair */}
        <div className="mt-auto">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full mt-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};
