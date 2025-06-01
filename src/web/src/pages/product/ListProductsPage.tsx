import { SideBar } from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Product, { formatBarCode, formatMoney } from "@/models/product.model";
import { decodeToken } from "@/services/auth.service";
import { deleteProduct, getAllProducts } from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AArrowDown,
  Banknote,
  Eye,
  GalleryHorizontalEnd,
  Hash,
  Menu,
  Pencil,
  Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type FilterOption = "name" | "category" | "quantity" | "price";

const ListProductsPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
      const products = await getAllProducts();
      setProducts(products);
      setLoading(false);
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
                <h2 className="text-2xl md:text-xl font-semibold">Produtos</h2>
                <p className="text-base">
                  {totalProducts} produtos cadastrados
                </p>
                <p className="text-base">Estoque total: {totalStock}</p>
              </div>

              {/* Formulário superior */}
              <form className="flex gap-2 w-full sm:max-w-md max-w-xs bg-white text-black border border-[--color-color-3] p-2 rounded-lg">
                <input
                  type="text"
                  placeholder="Pesquisar por..."
                  className="border p-1.5 rounded text-base w-full sm:w-50"
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
                  className="border p-1.5 rounded text-base bg-color-2"
                  onClick={() => navigate("/product/edit")}
                  disabled={!canEdit}
                >
                  + Produto
                </button>
                <button
                  type="submit"
                  className="border p-1.5 w-auto rounded text-base"
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* Formulário inferior (tabela) */}
            <form className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white border text-lg md:text-base">
                <thead className="bg-color-3 text-black border border-black ">
                  <tr>
                    <th className="px-4 py-3">Imagem</th>
                    <th className="px-4 py-3">Nome (Código de Barras)</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Estoque</th>
                    <th className="px-4 py-3">Preço Unitário</th>
                    <th className="px-4 py-3">Valor Total</th>
                    <th className="px-4 py-3">Ações</th>
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
                      <td className="border border-black px-4 py-3">
                        <div className="flex justify-center items-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 object-cover rounded"
                            />
                          ) : (
                            <img
                              src="/no-image.png"
                              alt="Imagem não disponível"
                              className="h-12 object-cover rounded"
                            />
                          )}
                        </div>
                      </td>
                      <td className="border border-black  px-4 py-3">{`${
                        product.name
                      } (${formatBarCode(product.barCode)})`}</td>
                      <td className="border border-black  px-4 py-3">
                        {product.category
                          ? product.category.name
                          : "Sem categoria"}
                      </td>
                      <td className="border border-black  px-4 py-3">
                        {product.quantity}
                      </td>
                      <td className="border border-black  px-4 py-3">
                        {formatMoney(product.unitPrice)}
                      </td>
                      <td className="border border-black  px-4 py-3">
                        {formatMoney(product.unitPrice * product.quantity)}
                      </td>
                      <td className={`border border-black  gap-x-2 px-4 py-3`}>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <Eye size={32} />
                        </button>
                        <button
                          className={canEdit ? `` : `hidden`}
                          onClick={() =>
                            navigate(`/product/edit/${product.id}`)
                          }
                        >
                          <Pencil size={32} />
                        </button>
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <button
                              className={canEdit ? `` : `hidden`}
                              disabled={product.quantity !== 0}
                              onClick={() => setProductToDelete(product)}
                            >
                              <Trash size={32} />
                            </button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir o produto "
                                {productToDelete?.name}"? Esta ação não pode ser
                                desfeita.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setProductToDelete(null);
                                  setIsDialogOpen(false);
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  await deleteProduct(
                                    productToDelete?.id ?? ""
                                  );
                                  setProducts((prev) =>
                                    prev.filter(
                                      (c) => c.id !== productToDelete?.id
                                    )
                                  );
                                  setProductToDelete(null);
                                  setIsDialogOpen(false);
                                  toast.success(
                                    `Produto "${productToDelete?.name}" excluído com sucesso!`
                                  );
                                }}
                              >
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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

export default ListProductsPage;
