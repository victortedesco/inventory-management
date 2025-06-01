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
import Category from "@/models/category.model";
import Product, { formatBarCode, formatMoney } from "@/models/product.model";
import { getAuditLogsByEntityId } from "@/services/audit-log.service";
import { decodeToken } from "@/services/auth.service";
import { deleteCategory, getCategoryById } from "@/services/category.service";
import {
  deleteProduct,
  getAllProductsByCategoryId,
} from "@/services/product.service";
import { getRolesWhoCanEdit } from "@/services/user.service";
import { Eye, Menu, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category>();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setCategoryId(id || null);
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const decodedToken = decodeToken(localStorage.getItem("token"));
      const canEdit = await getRolesWhoCanEdit();
      setCanEdit(canEdit.includes(decodedToken!.role));
      if (categoryId) {
        const category = await getCategoryById(categoryId);
        if (!category) {
          toast.error("Categoria não encontrada");
          navigate("/categories");
          return;
        }
        setCategory(category);
        const products = await getAllProductsByCategoryId(categoryId);
        setProducts(products);
        const auditLogs = await getAuditLogsByEntityId(categoryId);
        setAuditLogs(auditLogs);
        setLoading(false);
      }
    };
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchData().catch(console.error);
  }, [categoryId]);

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
        <div className="flex flex-col md:flex-row">
          <main className="w-full p-4">
            <div className="flex flex-col text-xl mb-4">
              <div className="flex items-center justify-between w-full">
              <p className="font-bold text-xl">Categoria</p>
              <div className={!canEdit ? "hidden" : "flex gap-2"}>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/category/edit/" + categoryId);
                  }}
                >
                  Editar
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" disabled={category?.productCount !== 0}>Excluir</Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar exclusão</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir a categoria "
                        {category?.name}"? Esta ação não pode ser desfeita.
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
                          await deleteCategory(category?.id ?? "");

                          setIsDialogOpen(false);
                          toast.success(
                            `Categoria "${category?.name}" excluída com sucesso!`
                          );
                          navigate("/categories");
                        }}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
              <p>Nome: {category?.name}</p>
              <p>Valor total: {formatMoney(category?.value ?? 0)}</p>
              <p>Estoque disponível: {category?.totalStock}</p>
            </div>
            <div>
              <div className="mb-4">
                <p className="font-semibold text-xl mb-4">
                  Produtos ({products.length})
                </p>
                <form className="overflow-x-auto rounded-lg">
                  <table className="min-w-full bg-white text-lg md:text-base">
                    <thead className="bg-color-3 border border-black text-black">
                      <tr>
                        <th className="px-4 py-3 ">Imagem</th>
                        <th className="px-4 py-3 ">Nome (Código de Barras)</th>
                        <th className="px-4 py-3 ">Estoque</th>
                        <th className="px-4 py-3 ">Preço Unitário</th>
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
                                  className="h-16 object-cover rounded"
                                />
                              ) : (
                                <img
                                  src="no-image.png"
                                  alt="Imagem não disponível"
                                  className="h-16 object-cover rounded"
                                />
                              )}
                            </div>
                          </td>
                          <td className="border border-black px-4 py-3">{`${
                            product.name
                          } (${formatBarCode(product.barCode)})`}</td>
                          <td className="border border-black px-4 py-3">
                            {product.quantity}
                          </td>
                          <td className="border border-black px-4 py-3">
                            {formatMoney(product.unitPrice)}
                          </td>
                          <td className="border border-black px-4 py-3">
                            {formatMoney(product.unitPrice * product.quantity)}
                          </td>
                          <td className="border border-black gap-x-2 px-4 py-3">
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
                            <Dialog
                              open={isDialogOpen}
                              onOpenChange={setIsDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <button
                                  className={canEdit ? `` : `hidden`}
                                  disabled={product.quantity !== 0}
                                  onClick={() => setProductToDelete(product)}
                                >
                                  <Trash size={32} />
                                </button>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar exclusão</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza que deseja excluir o produto "
                                    {productToDelete?.name}"? Esta ação não pode
                                    ser desfeita.
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    variant="secondary"
                                    onClick={() => {
                                      setProductToDelete(null);
                                      setIsDialogOpen(false);
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      await deleteProduct(
                                        productToDelete?.id || ""
                                      );
                                      setProducts((prev) =>
                                        prev.filter(
                                          (c) => c.id !== productToDelete?.id
                                        )
                                      );
                                      setProductToDelete(null);
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
              </div>
              <AuditLogHistory
                isSpecific={true}
                logs={auditLogs}
              ></AuditLogHistory>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
