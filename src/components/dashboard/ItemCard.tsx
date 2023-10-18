import { Item } from "@prisma/client";
import { api } from "rbgs/utils/api";

const ItemCard = ({ item }: { item: Item | null | undefined }) => {
  const { data: itemsCounts } = api.items.getItemCounts.useQuery({
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
    <div className="flex flex-col md:flex-row">
      <div className="inline h-56 w-56">
        <img
          className="aspect-square"
          src={"/" + item?.imgPath}
          alt={item?.name}
          key={item?.name}
        />
      </div>

      <div className="break-words bg-slate-400 p-5 text-neutral-800">
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
