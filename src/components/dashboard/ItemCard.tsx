import { Item } from "@prisma/client";
import { api } from "rbgs/utils/api";

const ItemCard = ({ item }: { item: Item | null | undefined }) => {
  const { data: itemsCounts } = api.general.getItemCounts.useQuery({
    id: item?.id as string,
  });

  let itemsTotal = -1;
  let itemsAvailable = -1;
  let itemsPrestados = -1;

  if (itemsCounts !== undefined) {
    itemsTotal = itemsCounts.totalCount;
    itemsAvailable = itemsCounts.availableCount;
    itemsPrestados = itemsCounts.prestadosCount;
  }

  return (
    <div className="flex flex-row flex-wrap">
      <img
        className="aspect-square max-h-60"
        src={"/" + item?.imgPath}
        alt={item?.name}
        key={item?.name}
      />
      <div className="w-3/6 break-words bg-slate-400 p-5 text-neutral-800">
        <ul>
          <li>
            {" "}
            <b>Nombre:</b> {item?.name}{" "}
          </li>
          <li>
            {" "}
            <b>Descripción:</b> {item?.description}{" "}
          </li>
          <li>
            {" "}
            <b>Categoría:</b> {item?.category}{" "}
          </li>
          <li>
            {" "}
            <b>Departamento:</b> {item?.department}{" "}
          </li>
          <br />
          <li>
            <b>Cantidad total de artículo:</b> {itemsTotal}
          </li>
          <li>
            <b>Cantidad disponible de artículo: </b>
            {itemsAvailable}
          </li>
          <li>
            <b>Cantidad en préstamo de artículo:</b>
            {itemsPrestados}
          </li>

          <br />
          <li>
            {" "}
            <b>Creado:</b> {item?.createdAt.toDateString()}{" "}
          </li>
          <li>
            {" "}
            <b>Actualizado:</b> {item?.updatedAt.toDateString()}{" "}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ItemCard;
