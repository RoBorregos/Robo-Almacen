import { GeneralCard } from "./GeneralCard";
import { api } from "../../utils/api";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useState } from "react";

// Prestamo card must contain:
// Button to return items
// Count of the amount of items
// Date of order
// Date of return (if returned)

export const PrestamoCard = ({
  id,
  showUser = true,
}: {
  id: string;
  showUser: boolean;
}) => {
  const { data: prestamo, isLoading } =
    api.prestamos.getPrestamoDetailsById.useQuery({
      id: id,
    });

  if (isLoading) {
    return (
      <GeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          Cargando...
        </h6>
      </GeneralCard>
    );
  } else if (prestamo) {
    return (
      <GeneralCard
        title={prestamo.CeldaItem.Item.name}
        imageLink={prestamo.CeldaItem.Item.imgPath}
      >
        <div className="flex flex-col">
          <div className="flex h-20 w-full flex-col justify-around align-middle">
            <h3>Detalles del préstamo</h3>
            <p>Fecha de préstamo: {prestamo.initialDate.toDateString()}</p>
            <p>Cantidad: {prestamo.quantity}</p>
            {showUser && <p>Usuario: {prestamo.User.name}</p>}
            {prestamo.returned && prestamo.finalDate && (
              <p>Fecha de regreso: {prestamo.finalDate?.toDateString()}</p>
            )}
          </div>
          <button className="ml-auto mr-auto w-fit rounded-lg bg-blue-400 p-2 text-black">
            Devolver préstamo
          </button>
        </div>
      </GeneralCard>
    );
  } else {
    return (
      <GeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          No se encontró el préstamo
        </h6>
      </GeneralCard>
    );
  }
};
