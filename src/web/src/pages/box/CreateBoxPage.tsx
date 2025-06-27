import { SideBar } from "@/components/SideBar";
import { Box } from "@/models/box.model";
import {
  CreateBoxRequest,
  UpdateBoxRequest,
} from "@/requests/box-request.interface";
import { decodeToken } from "@/services/auth.service";
import { createBox, getBoxById, updateBox } from "@/services/box.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CreateBoxPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [boxId, setBoxId] = useState<string | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    barCode: "",
    quantity: "",
    unitPrice: "",
    discount: "",
    weight: "",
    depth: "",
    height: "",
    width: "",
  });

  useEffect(() => {
    setBoxId(id || null);
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
        navigate("/boxes");
        return;
      }

      if (boxId) {
        const box = await getBoxById(boxId);
        if (!box) {
          toast.error("Caixa não encontrada.");
          navigate("/boxes");
          return;
        }
        setBox(box);
        setFormData({
          name: box.name || "",
          discount: box.discount.toString(),
          weight: box.weight.toString(),
          depth: box.depth.toString(),
          height: box.height.toString(),
          width: box.width.toString(),
          quantity: box.stock.toString(),
          unitPrice: box.unitPrice.toString(),
          barCode: box.barCode || "",
        });
      }

      setLoading(false);
    };

    fetchData().catch(console.error);
  }, [boxId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(boxId ? "Atualizando caixa..." : "Cadastrando caixa...");

    try {
      console.log(formData);

      if (!boxId) {
        const request: CreateBoxRequest = {
          name: formData.name,
          barCode: formData.barCode,
          unitPrice: Number(formData.unitPrice),
          quantity: Number(formData.quantity),
          discount: Number(formData.discount),
          weight: Number(formData.weight),
          depth: Number(formData.depth),
          height: Number(formData.height),
          width: Number(formData.width),
        };
        await createBox(request);
      } else {
        const request: UpdateBoxRequest = {
          id: boxId,
          name: formData.name,
          barCode: formData.barCode,
          unitPrice: Number(formData.unitPrice),
          quantity: Number(formData.quantity),
          discount: Number(formData.discount),
          weight: Number(formData.weight),
          depth: Number(formData.depth),
          height: Number(formData.height),
          width: Number(formData.width),
        };
        await updateBox(boxId, request);
      }
      toast.success("Caixa salva com sucesso!");
      navigate("/boxes");
    } catch (error) {
      toast.error("Erro ao salvar caixa.");
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
              {boxId ? "Atualizar" : "Adicionar"} caixa
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {boxId && (
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={boxId}
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
                max="999999"
                placeholder="Estoque"
                value={formData.quantity}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="unitPrice"
                step="0.01"
                min="0.01"
                max="999999.99"
                placeholder="Preço por unidade (R$ 0,00)"
                value={formData.unitPrice}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="discount"
                step="0.01"
                min="0"
                max="100"
                placeholder="Desconto (%)"
                value={formData.discount}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="weight"
                step="0.01"
                min="0"
                placeholder="Peso (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="depth"
                step="0.01"
                min="0"
                placeholder="Profundidade (cm)"
                value={formData.depth}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="height"
                step="0.01"
                min="0"
                placeholder="Altura (cm)"
                value={formData.height}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="width"
                step="0.01"
                min="0"
                placeholder="Largura (cm)"
                value={formData.width}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="text"
                name="barCode"
                pattern="\d{13}"
                maxLength={13}
                placeholder="Código de Barras"
                value={formData.barCode}
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

export default CreateBoxPage;
