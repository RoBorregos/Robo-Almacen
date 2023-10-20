import { VerticalGeneralCard } from "./VerticalGeneralCard";
import { api } from "../../utils/api";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useState } from "react";

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
  const context = api.useContext();
  const { data: item, isLoading } = api.items.getItemById.useQuery({
    id: id,
  });

  const {data: availableCount} = api.items.getItemAvailableCount.useQuery({
    id: id,
  });

  const createPrestamo = api.prestamos.createPrestamo.useMutation({
    onSuccess: (message) => {
      alert(message);
      void context.items.getItemCounts.invalidate();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const [amount, setAmount] = useState(1);
  const [description, setDescription] = useState("");

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
        className={className}
        title={item.name + " - (" + (availableCount ? availableCount.toString() : "cargando...") + " disponibles)"}
        imageLink={item.imgPath}
      >
        <div className="flex flex-col">
          <div className="mb-2 flex h-fit w-full flex-row justify-around align-middle">
            <AiOutlineMinusCircle
              className="text-black"
              size={40}
              onClick={() => {
                if (amount > 1) setAmount(amount - 1);
              }}
            />

            <p className="text-4xl text-black">{amount}</p>

            <AiOutlinePlusCircle
              className="text-black"
              size={40}
              onClick={() => {
                const maxPossible = Math.min(amount + 1, availableCount ?? 0);
                setAmount(maxPossible);
              }}
            />
          </div>
          <input
            className="mb-2 rounded-md bg-slate-900 p-2 text-2xl"
            placeholder="Descripción del pedido"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <button
            onClick={() =>
              createPrestamo.mutate({
                id: id,
                quantity: amount,
                description: description,
              })
            }
            className="ml-auto mr-auto w-fit rounded-lg bg-blue-400 p-2 text-black"
          >
            Pedir {amount} {item.name}
          </button>
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
