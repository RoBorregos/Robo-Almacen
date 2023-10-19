import { GeneralCard } from "./GeneralCard";
import { api } from "../../utils/api";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useState } from "react";

// Item Card must contain:
// Buttons to edit order amount
// Button to order item
// Count of the amount of items
// Validate min and max amount to order

export const ItemCard = ({ id }: { id: string }) => {
  const { data: item, isLoading } = api.items.getItemById.useQuery({
    id: id,
  });

  const [amount, setAmount] = useState(0);

  if (isLoading) {
    return (
      <GeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          Cargando...
        </h6>
      </GeneralCard>
    );
  } else if (item) {
    return (
      <GeneralCard title={item.name} imageLink={item.imgPath}>
        <div className="flex flex-col">
          <div className="flex h-20 w-full flex-row justify-around align-middle">
            <AiOutlineMinusCircle
              className="text-black"
              size={40}
              onClick={() => {
                if (amount > 0) setAmount(amount - 1);
              }}
            />

            <p className="text-4xl text-black">{amount}</p>

            <AiOutlinePlusCircle
              className="text-black"
              size={40}
              onClick={() => {
                setAmount(amount + 1);
              }}
            />
          </div>
          <button className="ml-auto mr-auto w-fit rounded-lg bg-blue-400 p-2 text-black">
            Pedir {amount} {item.name}
          </button>
        </div>
      </GeneralCard>
    );
  } else {
    return (
      <GeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          No se encontró el artículo
        </h6>
      </GeneralCard>
    );
  }
};
