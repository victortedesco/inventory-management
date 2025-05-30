import { SideBar } from "@/components/SideBar";
import Category from "@/models/category.model";
import Product, { formatMoney } from "@/models/product.model";
import { decodeToken } from "@/services/auth.service";
import { getCategoryById } from "@/services/category.service";
import { getAllProducts, getProductById } from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>();
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (!id) {
      toast.error("Produto não encontrado");
      navigate("/products");
      return;
    }
    setProductId(id || null);
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
      if (productId) {
        const product = await getProductById(productId);
        if (!product) {
          toast.error("Produto não encontrado");
          navigate("/products");
          return;
        }
        setProduct(product);
      }
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [productId]);

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
          <main className="w-full p-4 flex flex-col items-center md:items-start md:flex-row gap-8">
            {/* Imagem */}
            <div className="w-48 h-48 bg-gray-300 rounded-md overflow-hidden">
              {product?.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src="/no-image.png"
                  alt="Imagem não disponível"
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>

            {/* Informações do produto */}
            <div className="flex-1 space-y-2 text-left">
              <p>
                <strong>Nome:</strong> {product?.name}
              </p>
              <p>
                <strong>Categoria:</strong> {product?.category?.name}
              </p>
              <p>
                <strong>Preço unitário:</strong>{" "}
                {formatMoney(product?.unitPrice || 0)}
              </p>
              <p>
                <strong>Estoque disponível:</strong> {product?.quantity}
              </p>
              <p>
                <strong>Valor Total:</strong>{" "}
                {formatMoney(
                  (product?.unitPrice || 0) * (product?.quantity || 0)
                )}
              </p>
            </div>

            {/* Histórico (simulação com 3 registros estáticos por enquanto) */}
            <div className="w-full mt-6 md:mt-0 md:w-1/2">
              <h2 className="font-semibold mb-2">Histórico</h2>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  Registro 1: Entrada de 10 unidades
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  Registro 2: Saída de 5 unidades
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  Registro 3: Atualização de preço
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
