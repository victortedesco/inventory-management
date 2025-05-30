import { SideBar } from "@/components/SideBar";
import { deleteProduct } from "@/services/product.service";
import { Eye, Menu, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface Box {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  dimensions: string; // exemplo: "30x20x10"
  weight: number; // em kg
}

const mockBoxes: Box[] = [
  {
    id: "1",
    name: "Caixa Média",
    basePrice: 50.0,
    finalPrice: 45.0,
    quantity: 20,
    dimensions: "30x20x15",
    weight: 1.2,
  },
  {
    id: "2",
    name: "Caixa Grande",
    basePrice: 80.0,
    finalPrice: 72.0,
    quantity: 10,
    dimensions: "50x40x30",
    weight: 2.5,
  },
];

const ListBoxesPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);

  useEffect(() => {
    // Simular carregamento
    setBoxes(mockBoxes);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64 shrink-0">
        <SideBar isOpen={true} setIsOpen={setSidebarOpen} />
      </div>
      <div className="md:hidden">
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 p-4 relative">
        <button
          className="md:hidden absolute top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={32} />
        </button>

        <main className="p-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Caixas</h2>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border text-sm md:text-base">
              <thead className="bg-color-3 text-black border border-black gap-x-2">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Preço Base</th>
                  <th className="px-4 py-3">Preço Final</th>
                  <th className="px-4 py-3">Quantidade</th>
                  <th className="px-4 py-3">Dimensões (cm)</th>
                  <th className="px-4 py-3">Peso (kg)</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {boxes.map((box, index) => (
                  <tr
                    key={box.id}
                    className={index % 2 === 0 ? "bg-color-1" : "bg-color-2"}
                  >
                    <td className="border border-black px-4 py-3">
                      {box.name}
                    </td>
                    <td className="border border-black px-4 py-3">
                      R$ {box.basePrice.toFixed(2)}
                    </td>
                    <td className="border border-black px-4 py-3">
                      R$ {box.finalPrice.toFixed(2)}
                    </td>
                    <td className="border border-black px-4 py-3">
                      {box.quantity}
                    </td>
                    <td className="border border-black px-4 py-3">
                      {box.dimensions}
                    </td>
                    <td className="border border-black px-4 py-3">
                      {box.weight.toFixed(2)}
                    </td>
                    <td className="border border-black px-4 py-3 text-center">
                      <button onClick={() => navigate(`/box/${box.id}`)}>
                        <Eye size={32} />
                      </button>
                      <button onClick={() => navigate(`/box/edit/${box.id}`)}>
                        <Pencil size={32} />
                      </button>
                      <button onClick={async () => {}}>
                        <Trash size={32} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListBoxesPage;
