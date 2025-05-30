import { SideBar } from "@/components/SideBar";
import Category from "@/models/category.model";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/requests/category-request.interfaces";
import { decodeToken } from "@/services/auth.service";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "@/services/category.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateCategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    setCategoryId(id || null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = decodeToken(token);
      const canEditRoles = await getRolesWhoCanEdit();

      if (!decodedToken || !canEditRoles.includes(decodedToken.role)) {
        toast.error("Você não tem permissão para acessar esta página.");
        navigate("/categories");
        return;
      }

      if (categoryId) {
        const category = await getCategoryById(categoryId);
        if (!category) {
          toast.error("Categoria não encontrada.");
          navigate("/categories");
          return;
        }

        setCategory(category);
        setFormData({
          id: category.id,
          name: category.name,
        });
      }

      setLoading(false);
    };

    fetchData().catch(console.error);
  }, [categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue = value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(
      categoryId ? "Atualizando categoria..." : "Cadastrando categoria..."
    );

    try {
      console.log(formData);
      if (!categoryId) {
        const request: CreateCategoryRequest = {
          name: formData.name,
        };
        await createCategory(request);
      } else {
        const request: UpdateCategoryRequest = {
          id: categoryId,
          name: formData.name,
        };
        await updateCategory(Number(categoryId), request);
      }
       toast.success("Categoria salva com sucesso!");
      navigate("/categories");
    } catch (error) {
      toast.error("Erro ao salvar a categoria.");
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
              {categoryId ? "Atualizar" : "Adicionar"} Categoria
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {categoryId && (
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={formData.id}
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

              <button
                type="submit"
                className="bg-color-1 text-white rounded py-2 hover:bg-color-3 transition"
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

export default CreateCategoryPage;
