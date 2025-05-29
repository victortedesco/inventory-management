import { SideBar } from "@/components/SideBar";
import Product, { formatMoney } from "@/models/product.model";
import { decodeToken } from "@/services/auth.service";
import { getAllCategories } from "@/services/category.service";
import { getAllProducts } from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import {
  AArrowDown,
  Banknote,
  GalleryHorizontalEnd,
  Hash,
  Menu,
  Pencil,
  Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type FilterOption = "name" | "category" | "quantity" | "price";

const ProductPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
      const products = await getAllProducts();
      setProducts(products);
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [navigate]);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const filterIcons: Record<FilterOption, React.JSX.Element> = {
    name: <AArrowDown size={24} />, //Nome do produto
    category: <GalleryHorizontalEnd size={24} />, // Categoria
    quantity: <Hash size={24} />, // Quantidade
    price: <Banknote size={24} />, // Preço
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
                  {totalProducts} produtos cadastrados
                </p>
                <p className="text-base md:text-sm">
                  Estoque total: {totalStock}
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
                  onClick={() => navigate("/product")}
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
                    <th className="px-4 py-3 border ">Imagem</th>
                    <th className="px-4 py-3 border ">Itens</th>
                    <th className="px-4 py-3 border ">Categoria</th>
                    <th className="px-4 py-3 border ">Estoque</th>
                    <th className="px-4 py-3 border ">Preço</th>
                    <th className="px-4 py-3 border ">Ações</th>
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
                      <td className="flex justify-center border px-4 py-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 object-cover rounded"
                          />
                        ) : (
                          <img
                            src="no-image.png"
                            alt="Imagem não disponível"
                            className="h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="border  px-4 py-3">{product.name}</td>
                      <td className="border  px-4 py-3">
                        {product.category ? product.category.name : "Sem categoria"}
                      </td>
                      <td className="border  px-4 py-3">{product.quantity}</td>
                      <td className="border  px-4 py-3">
                        { formatMoney(product.unitPrice) }
                      </td>
                      <td className={canEdit ? `border  px-4 py-3` : `hidden`}>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
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

export default ProductPage;
