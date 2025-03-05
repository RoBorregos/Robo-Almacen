import { VerticalGeneralCard } from "./VerticalGeneralCard";
import { api } from "../../utils/api";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../r/components/ui/dialog";
import { Button } from "r/components/ui/button";

// Item Card must contain:
// Buttons to edit order amount
// Button to order item
// Count of the amount of items
// Validate min and max amount to order

export const ItemCard = ({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) => {
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const context = api.useUtils();

  const { data: item, isLoading } = api.items.getItemById.useQuery({
    id: id,
  });

  // TODO: get the max available count
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
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      void context.items.getItemCounts.invalidate();
      setOpen(false); // Close dialog on success
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

  if (isLoading) {
    return (
      <VerticalGeneralCard className={className}>
        <h6 className="text-center text-4xl font-bold text-white">
          Cargando...
        </h6>
      </VerticalGeneralCard>
    );
  } else if (item) {
    return (
      <VerticalGeneralCard
        className={
          className + " cursor-default border-0 shadow-xl shadow-black"
        }
        title={
          item.name +
          " - (" +
          (totalAvailableCount !== undefined
            ? totalAvailableCount.toString()
            : "cargando...") +
          " disponibles)"
        }
        imageLink={item.imgPath}
      >
        <div className="flex flex-col">
          <div className="mb-2 flex h-fit w-full flex-row justify-around align-middle">
            <AiOutlineMinusCircle
              className={`text-black transition duration-300 ${
                amount === 1 ? "opacity-50" : "cursor-pointer hover:scale-110"
              }`}
              size={30}
              color="#1D4ED8"
              onClick={() => {
                if (amount > 1) setAmount(amount - 1);
              }}
            />

            <p className="text-4xl text-black">{amount}</p>

            <AiOutlinePlusCircle
              className={`text-black transition duration-300 ${
                amount === (availableCount ?? 0)
                  ? "opacity-50"
                  : "cursor-pointer hover:scale-110"
              }`}
              size={30}
              color="#1D4ED8"
              onClick={() => {
                const maxPossible = Math.min(amount + 1, availableCount ?? 0);
                setAmount(maxPossible);
              }}
            />
          </div>
          <input
            className="text-md mb-2 rounded-md bg-slate-900 p-2"
            placeholder="Descripción del pedido (opcional)"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-3 w-full rounded-lg bg-blue-700 p-2 text-white transition duration-300 hover:bg-blue-800">
                Pedir {amount} {item.name}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="mb-3 w-full text-center font-mono text-lg">
                  Casilleros disponibles
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  {celdasWithItem?.map(
                    (celdaItem) =>
                      celdaItem.quantity >= amount && (
                        <Button
                          key={celdaItem.id}
                          onClick={() => {
                            createPrestamo.mutate({
                              id: id,
                              quantity: amount,
                              description: description,
                              celdaId: celdaItem.Celda.id,
                              celdaItemId: celdaItem.id,
                            });
                          }}
                          variant="outline"
                          className="rounded-lg bg-black p-2 text-white transition duration-300 hover:bg-blue-700"
                        >
                          {celdaItem.Celda.name} ({celdaItem.quantity}{" "}
                          disponibles)
                        </Button>
                      )
                  )}
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </VerticalGeneralCard>
    );
  } else {
    return (
      <VerticalGeneralCard className={className}>
        <h6 className="text-center text-4xl font-bold text-white">
          No se encontró el artículo
        </h6>
      </VerticalGeneralCard>
    );
  }
};
