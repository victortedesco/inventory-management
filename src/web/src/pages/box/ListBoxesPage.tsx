import { SideBar } from "@/components/SideBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Box from "@/models/box.model";
import { formatMoney } from "@/models/product.model";
import { decodeToken } from "@/services/auth.service";
import { getAllBoxes, deleteBox } from "@/services/box.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import {
  AArrowDown,
  Menu,
  Pencil,
  ShoppingBag,
  Trash,
  BadgeDollarSign,
  Eye,
  Container,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

type FilterOption = "name" | "totalStock" | "productCount" | "value";

const ListBoxesPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxToDelete, setBoxToDelete] = useState<Box | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const boxes = await getAllBoxes();
      setBoxes(boxes);
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
      setLoading(false);
    };

    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [navigate]);

  const totalBoxes = boxes.length;

  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("name");

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    setShowFilterOptions(false);
  };

  const filterIcons: Record<FilterOption, React.JSX.Element> = {
    name: <AArrowDown size={24} />,
    totalStock: <Container size={24} />,
    productCount: <ShoppingBag size={24} />,
    value: <BadgeDollarSign size={24} />,
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

        {/* Caixas fofas */}

        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <h2 className="text-2xl md:text-xl font-semibold">Caixas</h2>
                <p className="text-base">{totalBoxes} caixas cadastradas</p>
              </div>

              {/* Formulário superior */}
              <form className="flex gap-2 w-full sm:max-w-md max-w-xs bg-white text-black border p-2 rounded-lg">
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
                          Nome
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("totalStock")}
                        >
                          Estoque total
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("productCount")}
                        >
                          Quantidade de produtos
                        </li>
                        <li
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleFilterSelect("value")}
                        >
                          Valor
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="border p-1.5 rounded text-base bg-color-2"
                  onClick={() => navigate("/box/edit")}
                  disabled={!canEdit}
                >
                  + Caixa
                </button>
                <button
                  type="submit"
                  className="border p-1.5 rounded w-auto text-base"
                >
                  Enviar
                </button>
              </form>
            </div>

            {/* Formulário inferior (tabela) */}
            <form className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white text-lg md:text-base">
                <thead className="bg-color-3 text-black border border-black ">
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
                      key={index}
                      className={`text-center ${
                        index % 2 === 0 ? "bg-color-1" : "bg-color-2"
                      }`}
                    >
                      <td className="border border-black px-4 py-3">
                        {box.name}
                      </td>
                      <td className="border border-black px-4 py-3">
                        {formatMoney(box.unitPrice)}
                      </td>
                      <td className="border border-black px-4 py-3">
                        {formatMoney(box.unitPrice * (1 - box.discount / 100))}
                      </td>
                      <td className="border border-black px-4 py-3">
                        {box.quantity}
                      </td>
                      <td className="border border-black px-4 py-3">
                        {`${box.depth} x ${box.height} x ${box.width}`}
                      </td>
                      <td className="border border-black px-4 py-3">
                        {box.weight} kg
                      </td>
                      <td className="border border-black gap-x-2 px-4 py-3">
                        <button
                          onClick={() => navigate(`/box/${box.id}`)}
                        >
                          <Eye size={32} />
                        </button>
                        <button
                          className={canEdit ? `` : `hidden`}
                          onClick={() =>
                            navigate(`/box/edit/${box.id}`)
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
                              disabled={box.productCount !== 0}
                              onClick={() => setBoxToDelete(box)}
                            >
                              <Trash size={32} />
                            </button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmar exclusão</DialogTitle>
                              <DialogDescription>
                                Tem certeza que deseja excluir a caixa "
                                {boxToDelete?.name}"? Esta ação não pode ser
                                desfeita.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setBoxToDelete(null);
                                  setIsDialogOpen(false);
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={async () => {
                                  await deleteBox(boxToDelete?.id ?? "");
                                  setBoxes((prev) =>
                                    prev.filter((c) => c.id !== boxToDelete?.id)
                                  );
                                  setBoxToDelete(null);
                                  setIsDialogOpen(false);
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

export default ListBoxesPage;
