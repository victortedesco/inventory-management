import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProductQuantity } from "@/services/box.service";

const ChangeProductQuantityModal = ({
  isOpen,
  setIsOpen,
  boxId,
  boxProductQuantity,
  product,
  onQuantityChanged,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  boxId: string;
  boxProductQuantity: number;
  product: { id: string; name: string };
  onQuantityChanged?: () => void;
}) => {
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setNewQuantity(boxProductQuantity);
    }
  }, [boxProductQuantity, isOpen]);

  const handleConfirm = async () => {
    await updateProductQuantity(boxId, product.id, newQuantity);
    onQuantityChanged?.(); // Optional callback
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar quantidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Produto:</strong> {product.name}
          </p>
          <p>
            <strong>Quantidade atual:</strong> {boxProductQuantity}
          </p>
          <Input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            min={0}
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProductQuantityModal;
