import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/models/product.model";
import { getAllProducts } from "@/services/product.service";
import { addProductToBox } from "@/services/box.service";

interface AddProductModalProps {
  existingProducts?: Product[];
  boxId: string;
  onAddProduct: () => void;
}

export default function AddProductModal({
  existingProducts,
  boxId,
  onAddProduct,
}: AddProductModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      let products = await getAllProducts();
      if (existingProducts) {
        products = products.filter(
          (product) =>
            !existingProducts.some((p) => p.id === product.id)
        );
      }
      setProducts(products);
    };
    getProducts();
  }, [boxId]);

  const handleConfirm = async () => {
    if (selectedProductId) {
      await addProductToBox(boxId, selectedProductId);
      setOpen(false);
      setSelectedProductId(null);
      onAddProduct();
    }
  };

  return (
    <>
      <Button variant="default" onClick={() => setOpen(true)}>
        Adicionar Produtos
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>Selecione um produto</DialogHeader>

          <Select onValueChange={(value) => setSelectedProductId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  <div className="flex items-center gap-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-6 h-6 rounded object-cover border"
                    />
                    <span>{product.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedProductId}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
