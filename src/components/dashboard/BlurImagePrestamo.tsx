import * as React from "react";
import { useRouter } from "next/router";
import { Item } from "@prisma/client";
import GenButton from "../buttons/GenericButton";
import { api } from "rbgs/utils/api";

const displayType: { [key: string]: string } = {
  row: "h-1/3 w-1/3",
  column: "aspect-square",
};

const BlurImagePrestamo = ({
  idPrestamo,
  type = "column",
}: {
  idPrestamo: string;
  type?: string;
}) => {
  const { data: prestamo } = api.general.getPrestamoDetailsById.useQuery({
    id: idPrestamo,
  });
  const item: Item | undefined = prestamo?.CeldaItem.Item;

  const router = useRouter();

  return (
    <div
      className={`group/item relative ${displayType[type]}`}
      key={prestamo?.id}
    >
      <img
        className="aspect-square opacity-100 duration-300 hover:opacity-80"
        src={item?.imgPath}
        alt={item?.name}
        key={item?.name}
      />
      <div className="absolute top-0 w-full text-center text-white duration-300">
        <h1 className="bg-black/50">
          {prestamo?.finalDate
            ? "Fecha final: " + prestamo?.finalDate?.toDateString()
            : "Fecha de inicio: " + prestamo?.initialDate?.toDateString()}
        </h1>
        <h2 className="pl-3 text-left font-bold opacity-0 duration-300 group-hover/item:bg-black/50 group-hover/item:opacity-100">
          {item?.name}, Cantidad: {prestamo?.quantity}
        </h2>
      </div>

      {prestamo?.returned ? (
        <GenButton
          title="Ver préstamos de material"
          size="large"
          className="absolute bottom-2 right-1/2 translate-x-1/2 opacity-0 duration-300 group-hover/item:opacity-100"
          onclick={() => {router.push(`/dashboard/${item?.id}`)}}
        />
      ) : (
        <GenButton
          title="Devolver"
          size="large"
          className="absolute bottom-2 right-1/2 translate-x-1/2 opacity-0 duration-300 group-hover/item:opacity-100"
        />
      )}
    </div>
  );
};

export default BlurImagePrestamo;
