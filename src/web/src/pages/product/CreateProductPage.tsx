import { SideBar } from "@/components/SideBar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function CreateProductPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    preco: "",
    categoria: "",
    caixa: "",
    codigoBarras: "",
    imagem: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "imagem" && files) {
      setFormData({ ...formData, imagem: files[0] });
    } else {
      setFormData({ ...formData, [name]: value.replace(",", ".") });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Cadastrou o produto 👍");
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
      <div className="flex-1 bg-gray-100 p-4 sm:p-6 relative">
        {/* Botão menu hamburguer no mobile */}
        <button
          className={`md:hidden absolute top-4 left-4 z-50 ${
            sidebarOpen ? "hidden" : ""
          }`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>
        {/* Formulário de Cadastro de Produto */}
        <div className="flex justify-center items-start">
          <div className="bg-white p-8 rounded-xl shadow-lg w-80">
            <p className="text-center text-xl font-bold mb-4">
              Adicionar Produto
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                name="quantidade"
                step="1"
                placeholder="Quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                type="number"
                step="0.01"
                min="0"
                max="999999"
                name="preco"
                placeholder="Preço por unidade (R$ 0,00)"
                value={formData.preco}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Dropdown menu */}
              <input
                type="text"
                name="categoria"
                placeholder="Categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* Dropdown menu */}
              <input
                type="text"
                name="caixa"
                placeholder="Caixa"
                value={formData.caixa}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="text"
                name="codigoBarras"
                pattern="\d{13}"
                maxLength={13}
                placeholder="Código de Barras"
                value={formData.codigoBarras}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="flex flex-col items-center border rounded px-3 py-2 bg-gray-50">
                <label className="w-full text-center text-gray-500 cursor-pointer">
                  📤 Imagem
                  <input
                    type="file"
                    name="imagem"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {formData.imagem && (
                  <span className="text-xs text-gray-600 mt-2">
                    {formData.imagem.name}
                  </span>
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
}

export default CreateProductPage;
