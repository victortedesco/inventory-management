import { SideBar } from "@/components/SideBar";
import Category from "@/models/category.model";
import { CreateCategoryRequest } from "@/requests/add-category-request";
import { decodeToken } from "@/services/auth.service";
import { getCategoryById, postCategory, updateCategory } from "@/services/category.service";
import {
  getRolesWhoCanEdit,
} from "@/services/user.service";
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

    // Só executa após `userId` estar definido (inclusive se for null)
    if (categoryId !== undefined) {
      fetchData().catch(console.error);
    }
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
    toast.info("Cadastrando categoria...");
    console.log(formData);
    if (!categoryId) {
      const createCategory: CreateCategoryRequest = {
        name: formData.name,
      };
      const result = await postCategory(createCategory);

      if (result) {
        toast.success("Categoria cadastrada com sucesso.");
      } else {
        toast.error("Erro ao cadastrar categoria.");
      }
    } else {
      const createCategory: CreateCategoryRequest = {
        name: formData.name,
      };
      const result = await updateCategory(Number(categoryId), createCategory);

      if (result) {
        toast.success("Categoria atualizada com sucesso.");
      } else {
        toast.error("Erro ao atualizar categoria.");
      }
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

export default CreateCategoryPage;
