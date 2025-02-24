import { VerticalGeneralCard } from "./VerticalGeneralCard";
import { api } from "../../utils/api";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../r/components/ui/dialog"

// Item Card must contain:
// Buttons to edit order amount
// Button to order item
// Count of the amount of items
// Validate min and max amount to order

export const ItemCard = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");

  const context = api.useContext();

  const { data: item, isLoading } = api.items.getItemById.useQuery({
    id: id,
  });

  // TODO: get the max available count
  const { data: availableCount } = api.items.getMaxLockerItemCount.useQuery({
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
        className={className + " border-0 shadow-black shadow-xl cursor-default"}
        title={
          item.name +
          " - (" +
          (availableCount !== undefined ? availableCount.toString() : "cargando...") +
          " disponibles)"
        }
        imageLink={item.imgPath}
      >
        <div className="flex flex-col">
          <div className="mb-2 flex h-fit w-full flex-row justify-around align-middle">
            <AiOutlineMinusCircle
              className={`text-black duration-300 transition ${amount === 1 ? "opacity-50" : "cursor-pointer hover:scale-110"}`}
              size={30}
              color="#1D4ED8"
              onClick={() => {
                if (amount > 1) setAmount(amount - 1);
              }}
            />

            <p className="text-4xl text-black">{amount}</p>

            <AiOutlinePlusCircle
              className={`text-black duration-300 transition ${amount === (availableCount ?? 0) ? "opacity-50" : "cursor-pointer hover:scale-110"}`}
              size={30}
              color="#1D4ED8"
              onClick={() => {
                const maxPossible = Math.min(amount + 1, availableCount ?? 0);
                setAmount(maxPossible);
              }}
            />
          </div>
          <input
            className="mb-2 rounded-md bg-slate-900 p-2 text-md"
            placeholder="Descripción del pedido (opcional)"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full rounded-lg transition duration-300 hover:bg-blue-800 bg-blue-700 p-2 text-white mt-3">
                Pedir {amount} {item.name}
              </button>
            </DialogTrigger>
            <DialogContent className="fixed inset-0 flex items-center justify-center bg-transparent z-10">
              <div className="fixed inset-0 bg-black opacity-50 -z-10" />
              <div className="bg-white p-10 rounded-lg shadow-lg w-fit">
                <DialogHeader>
                  <DialogTitle className="w-full text-center mb-3 text-lg font-mono">Casilleros disponibles</DialogTitle>
                  <DialogDescription>
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      {celdasWithItem?.map((celdaItem) => (
                        celdaItem.quantity >= amount && (
                          <button
                            key={celdaItem.id}
                            onClick={() =>
                              createPrestamo.mutate({
                                id: id,
                                quantity: amount,
                                description: description,
                                celdaId: celdaItem.Celda.id,
                                celdaItemId: celdaItem.id,
                              })}
                            className="rounded-lg bg-black p-2 text-white w-24 transition duration-300 hover:bg-blue-700">
                            {celdaItem.Celda.name}
                          </button>
                        )
                      ))}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
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
