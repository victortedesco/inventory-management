import AuditLogHistory from "@/components/AuditLogHistory";
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
import { AuditLog } from "@/models/auditlog.model";
import {
  ProductWithBoxes,
  formatBarCode,
  formatMoney,
} from "@/models/product.model";
import { getAuditLogsByEntityId } from "@/services/audit-log.service";
import { decodeToken } from "@/services/auth.service";
import {
  deleteProduct,
  getProductWithBoxesById,
} from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Eye, Menu, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [productId, setProductId] = useState<string | null>(null);
  const [productWithBoxes, setProductWithBoxes] = useState<ProductWithBoxes>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [auditlogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

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
      if (productId) {
        const product = await getProductWithBoxesById(productId);
        if (!product) {
          toast.error("Produto não encontrado");
          navigate("/products");
          return;
        }
        setProductWithBoxes(product);
        const auditLogs = await getAuditLogsByEntityId(productId);
        setAuditLogs(auditLogs);
        setLoading(false);
      }
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
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

        <div className="flex flex-col">
          <main className="w-full p-4 flex flex-col items-center md:items-start gap-8 text-lg">
            {/* Imagem e informações */}
            <div className="flex items-center justify-between w-full">
              <p className="font-bold text-xl">Produto</p>
              <div className={!canEdit ? "hidden" : "flex gap-2"}>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/product/edit/" + productId);
                  }}
                >
                  Editar
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={productWithBoxes?.product.stock !== 0}
                    >
                      Excluir
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir o produto "
                        {productWithBoxes?.product.name}"? Esta ação não pode
                        ser desfeita.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsDialogOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await deleteProduct(
                            productWithBoxes?.product.id ?? ""
                          );

                          setIsDialogOpen(false);
                          toast.success(
                            `Produto "${productWithBoxes?.product.name}" excluído com sucesso!`
                          );
                          navigate("/products");
                        }}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex flex-col md:flex-row w-full gap-8">
              {/* Imagem */}
              <div className="w-64 h-64 bg-gray-300 rounded-md overflow-hidden">
                {productWithBoxes?.product.image ? (
                  <img
                    src={productWithBoxes.product.image}
                    alt={productWithBoxes.product.name}
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
              <div className="flex-1 space-y-3 text-left">
                <p>
                  <strong>Nome:</strong> {productWithBoxes?.product.name}
                </p>
                <p>
                  <strong>Código de Barras:</strong>{" "}
                  {formatBarCode(productWithBoxes?.product.barCode || "N/A")}
                </p>
                <p className="flex items-start gap-2">
                  <strong>Categoria:</strong>{" "}
                  {productWithBoxes?.product.category?.name || "Sem categoria"}{" "}
                  <button
                    className="flex p-0 m-0"
                    onClick={() =>
                      navigate(
                        `/category/${productWithBoxes?.product.category?.id}`
                      )
                    }
                  >
                    <Eye size={24} />
                  </button>
                </p>
                <p>
                  <strong>Preço Unitário:</strong>{" "}
                  {formatMoney(productWithBoxes?.product.unitPrice || 0)}
                </p>
                <p>
                  <strong>Estoque Unitário Disponível:</strong>{" "}
                  {productWithBoxes?.product.stock || 0}
                </p>
                <p>
                  <strong>Estoque Total Disponível:</strong>{" "}
                  {productWithBoxes?.product.totalStock || 0}
                </p>
                <p>
                  <strong>Valor Total:</strong>{" "}
                  {formatMoney(
                    (productWithBoxes?.product.unitPrice || 0) *
                      (productWithBoxes?.product.stock || 0)
                  )}
                </p>
              </div>
            </div>

            {/* Lista de caixas */}
            <div className="w-full">
              <p className="font-bold text-xl mb-4">Caixas</p>
              {productWithBoxes?.boxes.length === 0 ? (
                <p className="text-center text-gray-500">
                  Nenhuma caixa encontrada para este produto.
                </p>
              ) : (
                <table className="min-w-full bg-white text-lg md:text-base">
                  <thead className="bg-color-3 text-black border border-black ">
                    <tr>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Preço Base</th>
                      <th className="px-4 py-3">Preço Final</th>
                      <th className="px-4 py-3">Estoque</th>
                      <th className="px-4 py-3">Dimensões (cm)</th>
                      <th className="px-4 py-3">Peso (kg)</th>
                      <th className="px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productWithBoxes?.boxes.map((box, index) => (
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
                          {formatMoney(
                            box.unitPrice * (1 - box.discount / 100)
                          )}
                        </td>
                        <td className="border border-black px-4 py-3">
                          {box.stock}
                        </td>
                        <td className="border border-black px-4 py-3">
                          {`${box.depth} x ${box.height} x ${box.width}`}
                        </td>
                        <td className="border border-black px-4 py-3">
                          {box.weight} kg
                        </td>
                        <td className="border border-black gap-x-2 px-4 py-3">
                          <button onClick={() => navigate(`/box/${box.id}`)}>
                            <Eye size={32} />
                          </button>
                          <button
                            className={canEdit ? `` : `hidden`}
                            onClick={() => navigate(`/box/edit/${box.id}`)}
                          >
                            <Pencil size={32} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Histórico (abaixo) */}
            <AuditLogHistory
              isSpecific={true}
              logs={auditlogs}
            ></AuditLogHistory>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
