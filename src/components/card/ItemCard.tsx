"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../utils/api";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Skeleton } from "src/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

import { VerticalGeneralCard } from "./vertical-general-card";
import { QuantitySelector } from "./quantity-selector";
import { AvailabilityBadge } from "./availability-badge";
import { LockerSelectionDialog } from "./locker-selection-dialog";
import type { CeldaItem } from "./item";

interface ItemCardProps {
  id: string;
  className?: string;
}

export const ItemCard = ({ id, className = "" }: ItemCardProps) => {
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const context = api.useUtils();

  const { data: item, isLoading } = api.items.getItemById.useQuery({
    id: id,
  });

  // Get the max available count
  const { data: availableCount } = api.items.getMaxLockerItemCount.useQuery({
    id: id,
  });

  const { data: totalAvailableCount } =
    api.items.getItemAvailableCount.useQuery({
      id: id,
    });

  const { data: celdasWithItem } = api.celda.getCeldasWithItemId.useQuery({
    itemId: id,
    amount: amount,
  });

  const createPrestamo = api.prestamos.createPrestamo.useMutation({
    onSuccess: (message) => {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      void context.items.invalidate();
      setOpen(false); // Close dialog on success
      setAmount(1); // Reset amount
      setDescription(""); // Reset description
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const handleSelectLocker = (celdaItem: CeldaItem) => {
    if (!createPrestamo.isLoading) {
      createPrestamo.mutate({
        id: id,
        quantity: amount,
        description: description,
        celdaId: celdaItem.Celda.id,
        celdaItemId: celdaItem.id,
      });
    }
  };

  if (isLoading) {
    return (
      <VerticalGeneralCard className={`w-80 ${className}`}>
        <div className="space-y-4">
          <Skeleton className="mx-auto h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </VerticalGeneralCard>
    );
  }

  if (!item) {
    return (
      <VerticalGeneralCard className={`w-80 ${className}`}>
        <div className="py-8 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No se encontró el artículo
          </p>
        </div>
      </VerticalGeneralCard>
    );
  }

  return (
    <>
      <VerticalGeneralCard
        className={`w-80 cursor-default border-0 shadow-xl shadow-black ${className}`}
        title={item.name}
        imageLink={item.imgPath}
      >
        <div className="flex flex-col space-y-4">
          <AvailabilityBadge
            count={totalAvailableCount}
            isLoading={isLoading}
          />

          <div className="mb-2 mt-2">
            <QuantitySelector
              value={amount}
              onChange={setAmount}
              min={1}
              max={availableCount ?? 0}
            />
          </div>

          <div>
            <Label htmlFor="description" className="sr-only">
              Descripción del pedido
            </Label>
            <Input
              id="description"
              className="w-full rounded-md bg-slate-100 p-2 text-sm dark:bg-slate-900"
              placeholder="Descripción del pedido (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="mt-3 w-full rounded-lg bg-blue-700 p-2 text-white transition duration-300 hover:bg-blue-800"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Pedir {amount} {item.name}
          </Button>
        </div>
      </VerticalGeneralCard>

      <LockerSelectionDialog
        open={open}
        onOpenChange={setOpen}
        celdasWithItem={celdasWithItem}
        amount={amount}
        itemName={item.name}
        onSelectLocker={handleSelectLocker}
        isLoading={createPrestamo.isLoading}
      />
    </>
  );
};
