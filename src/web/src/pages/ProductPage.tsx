import { SideBar } from "@/components/SideBar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type FilterOption = "name" | "category" | "quantity" | "price";

function ProductPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  const products = [
    { name: "Blusa", category: "Roupa", stock: 30, price: 50.0, icon: "👕" },
    { name: "Doritos", category: "Comida", stock: 26, price: 8.0, icon: "🍿" },
    {
      name: "Bolsa",
      category: "Acessórios",
      stock: 10,
      price: 140.0,
      icon: "👜",
    },
    { name: "Camisa", category: "Roupa", stock: 42, price: 35.0, icon: "👔" },
  ];
  const totalItems = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const filterIcons: Record<FilterOption, string> = {
    name: "🔤", // Nome do produto
    category: "📂", // Categoria
    quantity: "🔢", // Quantidade
    price: "💰", // Preço
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
                <h2 className="text-2xl md:text-lg font-semibold">Produtos</h2>
                <p className="text-base md:text-sm">
                  {totalItems} Itens cadastrados
                </p>
                <p className="text-base md:text-sm">
                  Quantidade disponível: {totalStock}
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
                          Nome do produto
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("category")}
                        >
                          Categoria
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("quantity")}
                        >
                          Quantidade
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("price")}
                        >
                          Preço
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="border p-1.5 rounded text-base"
                  onClick={() => navigate("/create-product")}
                >
                  + Itens
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
                    <th className="px-4 py-3 border ">Itens</th>
                    <th className="px-4 py-3 border ">Categoria</th>
                    <th className="px-4 py-3 border ">Estoque</th>
                    <th className="px-4 py-3 border ">Preço</th>
                    <th className="px-4 py-3 border ">🗑️</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
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
                        {product.name} <span>{product.icon}</span>
                      </td>
                      <td className="border  px-4 py-3">{product.category}</td>
                      <td className="border  px-4 py-3">{product.stock}</td>
                      <td className="border  px-4 py-3">
                        R$ {product.price.toFixed(2)}
                      </td>
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

export default ProductPage;
