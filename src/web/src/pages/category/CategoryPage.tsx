import { SideBar } from "@/components/SideBar";
import Category from "@/models/category.model";
import Product, { formatBarCode, formatMoney } from "@/models/product.model";
import { decodeToken } from "@/services/auth.service";
import { getCategoryById } from "@/services/category.service";
import {
  deleteProduct,
  getAllProducts,
  getAllProductsByCategoryId,
} from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Eye, Menu, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category>();
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    setCategoryId(id || null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
      if (!decodedToken || !canEdit.includes(decodedToken.role)) {
        toast.error("Você não tem permissão para acessar esta página.");
        navigate("/categories");
        return;
      }
      if (categoryId) {
        const category = await getCategoryById(Number(categoryId));
        const products = await getAllProductsByCategoryId(Number(categoryId));
        if (!category) {
          toast.error("Categoria não encontrada");
          navigate("/categories");
          return;
        }
        setCategory(category);
        setProducts(products);
      }
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [categoryId]);

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
        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            <div className="flex flex-col">
              <p>Nome: {category?.name}</p>
              <p>Valor Total: {formatMoney(category?.value ?? 0)}</p>
              <p>Estoque disponível: {category?.totalStock}</p>
            </div>
            <div>
              <main>
                <form className="overflow-x-auto rounded-lg">
                  <table className="min-w-full bg-white border text-lg md:text-base">
                    <thead className="bg-color-3 text-black">
                      <tr>
                        <th className="px-4 py-3 border ">Imagem</th>
                        <th className="px-4 py-3 border ">
                          Nome (Código de Barras)
                        </th>
                        <th className="px-4 py-3 border ">Estoque</th>
                        <th className="px-4 py-3 border ">Preço Unitário</th>
                        <th className="px-4 py-3 border ">Valor Total</th>
                        <th className={canEdit ? `px-4 py-3 border` : `hidden`}>
                          Ações
                        </th>
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
                          <td className="border  px-4 py-3">{`${
                            product.name
                          } (${formatBarCode(product.barcode)})`}</td>
                          <td className="border  px-4 py-3">
                            {product.quantity}
                          </td>
                          <td className="border  px-4 py-3">
                            {formatMoney(product.unitPrice)}
                          </td>
                          <td className="border  px-4 py-3">
                            {formatMoney(product.unitPrice * product.quantity)}
                          </td>
                          <td
                            className={
                              canEdit ? `border gap-x-2 px-4 py-3` : `hidden`
                            }
                          >
                            <button
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              <Eye size={32} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/product/edit/${product.id}`)
                              }
                            >
                              <Pencil size={32} />
                            </button>
                            <button
                              onClick={async () =>
                                await deleteProduct(product.id)
                              }
                            >
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
