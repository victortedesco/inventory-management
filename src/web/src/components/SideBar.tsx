import { useEffect, useState } from "react";
import {
  BookUser,
  Boxes,
  Forklift,
  GalleryHorizontalEnd,
  History,
  LogOut,
  PackageSearch,
  X,
} from "lucide-react";
import User, { maskCPF } from "@/models/user.model";
import { decodeToken, logout } from "@/services/auth.service";
import { getUserById } from "@/services/user.service";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Product, { formatBarCode } from "@/models/product.model";
import Box from "@/models/box.model";
import { getAllBoxes } from "@/services/box.service";
import { addProductQuantity, getAllProducts } from "@/services/product.service";
import { Button } from "./ui/button";
import { toast } from "sonner";

type StockItem = ({ type: "product" } & Product) | ({ type: "box" } & Box);

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SideBar = ({ isOpen, setIsOpen }: SideBarProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const [allResults, setAllResults] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [quantityChange, setQuantityChange] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, boxes] = await Promise.all([
          getAllProducts(),
          getAllBoxes(),
        ]);

        const unifiedResults: StockItem[] = [
          ...products.map((p) => ({ ...p, type: "product" as const })),
          ...boxes.map((b) => ({ ...b, type: "box" as const })),
        ];

        setAllResults(unifiedResults);
      } catch (error) {
        console.error("Erro ao carregar produtos e caixas", error);
      }
    };

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filtered = allResults.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const barcode = item.barCode;
      const barcodeMatch = barcode?.includes(query);
      return nameMatch || barcodeMatch;
    });

    setSearchResults(filtered);
  }, [searchQuery, allResults]);

  const handleAdjustStock = async () => {
    if (!selectedItem) return;

    if (selectedItem.type === "product") {
      const updatedProduct = await addProductQuantity(
        selectedItem.id,
        quantityChange
      );
      if (!updatedProduct) {
        toast.error("Ocorreu um erro ao atualizar esse produto!");
        return;
      }
      setSelectedItem(selectedItem as StockItem)
    } else {
      // Atualize estoque da caixa
      //updateBoxStock(selectedItem.id, newQuantity);
    }

    // Resetar
    setSelectedItem(null);
    setQuantityChange(0);
    setSearchQuery("");
    setMoveDialogOpen(false);
  };

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
          {/* Botão de movimentação */}
          <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex cursor-pointer bg-green-100 items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300">
                <span className="flex-shrink-0 text-color-3">
                  {navItems[0].icon}
                </span>
                <span>{navItems[0].label}</span>
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-xl w-full">
              <DialogHeader>
                <DialogTitle>Movimentar Estoque</DialogTitle>
                <DialogDescription>
                  Busque um produto ou uma caixa pelo nome ou código de barras e
                  ajuste a quantidade disponível.
                </DialogDescription>
              </DialogHeader>

              {/* 🔍 Campo de busca */}
              <div className="mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSelectedItem(searchResults[0] || null);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nome ou Código de Barras"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </form>

                {/* 📋 Resultados da busca */}
                {searchResults.length > 0 && (
                  <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto bg-white shadow-sm">
                    {searchResults.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="text-sm">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500 text-xs">
                            {formatBarCode(item.barCode)}
                          </div>
                          <div className="text-xs text-gray-400 italic">
                            {item.type === "product" ? "Produto" : "Caixa"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ✅ Informações do item selecionado */}
              {selectedItem && (
                <div className="mt-6 flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-32 h-32 object-cover rounded-md border"
                  />

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-gray-700 font-semibold text-lg">
                        {selectedItem.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatBarCode(selectedItem.barCode)}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        {selectedItem.type === "product" ? "Produto" : "Caixa"}
                      </p>
                    </div>

                    {selectedItem.type === "product" && (
                      <div className="text-sm text-gray-600">
                        Categoria:{" "}
                        <span className="font-medium text-gray-800">
                          {selectedItem.category?.name || "Sem categoria"}
                        </span>
                      </div>
                    )}

                    {selectedItem.type === "box" && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Produtos: {selectedItem.productCount}</p>
                        <p>Únicos: {selectedItem.uniqueProductCount}</p>
                        <p>Peso: {selectedItem.weight} kg</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      Estoque atual:{" "}
                      <span className="font-medium text-gray-800">
                        {selectedItem.quantity}
                      </span>{" "}
                      unidades
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <label
                        htmlFor="quantity"
                        className="text-sm text-gray-700"
                      >
                        Ajuste de quantidade:
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={quantityChange}
                        onChange={(e) =>
                          setQuantityChange(Number(e.target.value))
                        }
                        className="w-24 border border-gray-300 rounded-md p-1 text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 🔘 Ações */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setMoveDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdjustStock}
                  disabled={!selectedItem || quantityChange === 0}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            </DialogContent>
          </Dialog>
          {navItems.slice(1).map((item) => (
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
        <div className="flex justify-center mt-auto">
          <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setExitDialogOpen(true)}
                className="w-1/4 flex justify-center mt-6 py-2 bg-red-500  text-white rounded-xl font-bold transition-colors"
              >
                <LogOut size={32} />
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-xl w-full">
              <DialogHeader>
                <DialogTitle>Sair</DialogTitle>
                <DialogDescription>
                  Deseja realmente sair do sistema?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setExitDialogOpen(false)}
                  className="w-16"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => logout()}
                  className="w-16"
                >
                  Sair
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
    </>
  );
};
