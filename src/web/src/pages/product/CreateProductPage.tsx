import { SideBar } from "@/components/SideBar";
import Category from "@/models/category.model";
import Product from "@/models/product.model";
import { CreateProductRequest } from "@/requests/add-product-request";
import { getAllCategories } from "@/services/category.service";
import { getProductById, postProduct, putProduct } from "@/services/product.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unitPrice: "",
    category: "",
    barcode: "",
    image: "",
  });

  useEffect(() => {
    setProductId(id || null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const allCategories = await getAllCategories();
      setCategories(allCategories);

      if (productId) {
        const product = await getProductById(productId);
        if (!product) {
          toast.error("Produto não encontrado.");
          navigate("/products");
          return;
        }
        setProduct(product);
        setFormData({
          name: product.name || "",
          quantity: product.quantity?.toString() || "",
          unitPrice: product.unitPrice?.toString() || "",
          category: product.category?.id || "",
          barcode: product.barcode || "",
          image: product.image || "",
        });
      }

      setLoading(false);
    };

    if (productId !== undefined) {
      fetchData().catch(console.error);
    }
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      name === "image" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFormData({ ...formData, image: base64 });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const request: CreateProductRequest = {
      name: formData.name,
      image: formData.image,
      barcode: formData.barcode,
      categoryId: formData.category.toString(),
      unitPrice: parseFloat(formData.unitPrice),
      quantity: parseInt(formData.quantity, 10),
    };

    e.preventDefault();
    toast.info(productId ? "Atualizando produto..." : "Cadastrando produto...");

    try {
      console.log(formData); // Aqui iria o envio à API
      console.log(request); // Aqui iria o envio à API
      if (productId) {
        await putProduct(productId, request); // Simula o envio à API
      } else {
        await postProduct(request); // Simula o envio à API
      }
      toast.success("Produto salvo com sucesso!");
      navigate("/products");
    } catch (error) {
      toast.error("Erro ao salvar produto.");
    }
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

      <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative">
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>

        <div className="flex justify-center items-start">
          <div className="bg-white p-8 rounded-xl shadow-lg w-80">
            <p className="text-center text-xl font-bold mb-4">
              {productId ? "Atualizar" : "Adicionar"} Produto
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {productId && (
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={productId}
                  disabled
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}

              <input
                type="text"
                name="name"
                placeholder="Nome"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="quantity"
                step="1"
                min="0"
                max="999999.99"
                placeholder="Quantidade"
                value={formData.quantity}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="unitPrice"
                step="0.01"
                min="0"
                max="999999.99"
                placeholder="Preço por unidade (R$ 0,00)"
                value={formData.unitPrice}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Selecione a Categoria
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="barcode"
                pattern="\d{13}"
                maxLength={13}
                placeholder="Código de Barras"
                value={formData.barcode}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="flex flex-col items-center border rounded px-3 py-2 bg-gray-50">
                <label className="w-full text-center text-gray-500 cursor-pointer">
                  📤 Imagem
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition"
              >
                Confirmar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
