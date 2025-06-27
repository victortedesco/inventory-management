import AuditLogHistory from "@/components/AuditLogHistory";
import AddProductModal from "@/components/modal/AddProductToBoxModal";
import ChangeProductQuantityModal from "@/components/modal/ChangeProductQuantityModal";
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
import { Box } from "@/models/box.model";
import { Product, formatBarCode, formatMoney } from "@/models/product.model";
import { getAuditLogsByEntityId } from "@/services/audit-log.service";
import { decodeToken } from "@/services/auth.service";
import { deleteBox, getBoxById } from "@/services/box.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Container, Eye, Menu, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const BoxPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [boxId, setBoxId] = useState<string | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productToChange, setProductToChange] = useState<Product | null>(null);
  const [isChangeProductQuantityOpen, setIsChangeProductQuantityOpen] =
    useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [auditlogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const selectedProduct = products.find((p) => p?.id === productToChange?.id);

  useEffect(() => {
    if (!id) {
      toast.error("Caixa não encontrada");
      navigate("/boxes");
      return;
    }
    setBoxId(id || null);
  }, [id]);

  const fetchData = async () => {
    const decodedToken = decodeToken(localStorage.getItem("token"));
    const canEdit = await getRolesWhoCanEdit();
    setCanEdit(canEdit.includes(decodedToken!.role));
    if (boxId) {
      const box = await getBoxById(boxId);
      if (!box) {
        toast.error("Caixa não encontrada");
        navigate("/boxes");
        return;
      }
      setBox(box);
      setProducts(box.products?.map((p) => p.product) || []);
      const auditLogs = await getAuditLogsByEntityId(boxId);
      setAuditLogs(auditLogs);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [boxId]);

  if (loading || !box) {
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
              <p className="font-bold text-xl">Caixa</p>
              <div className={!canEdit ? "hidden" : "flex gap-2"}>
                <AddProductModal
                  existingProducts={products}
                  boxId={box.id ?? ""}
                  onAddProduct={fetchData}
                ></AddProductModal>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/box/edit/" + boxId);
                  }}
                >
                  Editar
                </Button>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={box.productCount !== 0}
                    >
                      Excluir
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir o produto "{box.name}"?
                        Esta ação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsDeleteDialogOpen(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await deleteBox(box.id ?? "");

                          setIsDeleteDialogOpen(false);
                          toast.success(
                            `Caixa "${box.name}" excluída com sucesso!`
                          );
                          navigate("/boxes");
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
              {/* Informações da caixa */}
              <div className="flex-1 space-y-3 text-left">
                <p>
                  <strong>Nome:</strong> {box.name}
                </p>
                <p>
                  <strong>Código de Barras:</strong>{" "}
                  {formatBarCode(box.barCode || "N/A")}
                </p>
                <p>
                  <strong>Preço Unitário:</strong>
                   {formatMoney(box.unitPrice)}
                </p>
                <p>
                  <strong>Desconto:</strong> {box.discount}%
                </p>
                <p>
                  <strong>Preço Final:</strong>
                   {formatMoney(box.unitPrice * (1 - box.discount / 100))}
                </p>
                <p>
                  <strong>Estoque:</strong> {box.stock}
                </p>
                <p>
                  <strong>Peso:</strong> {box.weight} kg
                </p>
                <p>
                  <strong>Dimensões (C x L x A):</strong> {box.depth}cm x{" "}
                  {box.width}cm x {box.height}cm
                </p>
                <p>
                  <strong>Produtos Totais:</strong> {box.productCount}
                </p>
                <p>
                  <strong>Produtos Únicos:</strong> {box.uniqueProductCount}
                </p>
              </div>
            </div>

            {/* Lista de produtos */}
            <div className="w-full">
              <p className="font-bold text-xl mb-4">Produtos</p>
              {products?.length === 0 ? (
                <p className="text-center text-gray-500">
                  Nenhum produto encontrado para esta caixa.
                </p>
              ) : (
                <table className="min-w-full bg-white text-lg md:text-base">
                  <thead className="bg-color-3 text-black border border-black ">
                    <tr>
                      <th className="px-4 py-3">Imagem</th>
                      <th className="px-4 py-3">Nome (Código de Barras)</th>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3">Estoque Unitário</th>
                      <th className="px-4 py-3">Estoque Total</th>
                      <th className="px-4 py-3">Quantidade na caixa</th>
                      <th className="px-4 py-3">Preço Unitário</th>
                      <th className="px-4 py-3">Valor Total</th>
                      <th className="px-4 py-3">Ações</th>
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
                        <td className="border border-black px-4 py-3">
                          <div className="flex justify-center items-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 object-cover rounded"
                              />
                            ) : (
                              <img
                                src="/no-image.png"
                                alt="Imagem não disponível"
                                className="h-12 object-cover rounded"
                              />
                            )}
                          </div>
                        </td>
                        <td className="border border-black  px-4 py-3">{`${
                          product.name
                        } (${formatBarCode(product.barCode)})`}</td>
                        <td className="border border-black  px-4 py-3">
                          {product.category
                            ? product.category.name
                            : "Sem categoria"}
                        </td>
                        <td className="border border-black  px-4 py-3">
                          {product.stock}
                        </td>
                        <td className="border border-black  px-4 py-3">
                          {product.totalStock}
                        </td>
                        <td className="border border-black  px-4 py-3">
                          {box.products?.find(
                            (bp) => bp.product.id === product.id
                          )?.quantity || 0}
                        </td>
                        <td className="border border-black  px-4 py-3">
                          {formatMoney(product.unitPrice)}
                        </td>
                        <td className="border border-black  px-4 py-3">
                          {formatMoney(product.unitPrice * product.totalStock)}
                        </td>
                        <td
                          className={`border border-black  gap-x-2 px-4 py-3`}
                        >
                          {selectedProduct && (
                            <ChangeProductQuantityModal
                              isOpen={isChangeProductQuantityOpen}
                              setIsOpen={setIsChangeProductQuantityOpen}
                              boxId={boxId || ""}
                              boxProductQuantity={
                                box.products?.find((bp) => bp.product.id === selectedProduct.id)?.quantity || 0
                              }
                              product={selectedProduct}
                              onQuantityChanged={async () => {
                                await fetchData();
                              }}
                            />
                          )}

                          <Dialog
                            open={isChangeProductQuantityOpen}
                            onOpenChange={setIsChangeProductQuantityOpen}
                          >
                            <DialogTrigger asChild>
                              <button
                                className={canEdit ? `` : `hidden`}
                                onClick={() => {
                                  setProductToChange(product);
                                  setIsChangeProductQuantityOpen(true);
                                }}
                              >
                                <Container size={32} />
                              </button>
                            </DialogTrigger>
                          </Dialog>
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            <Eye size={32} />
                          </button>
                          <button
                            className={canEdit ? `` : `hidden`}
                            onClick={() =>
                              navigate(`/product/edit/${product.id}`)
                            }
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

export default BoxPage;
