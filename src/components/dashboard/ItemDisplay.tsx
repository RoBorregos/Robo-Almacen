import { Item, Prestamo, CeldaItem } from "@prisma/client";
import { api } from "rbgs/utils/api";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import React, { useState } from "react";
import BlurImageItem from "./BlurImageItem";

// Interace to personalize display of component
interface ItemDisplayStyle {
  columns: number;
  type: string;
  title: string;
  color: string;
  placeHolder?: string;
  width: string;
}

const colorVariants: { [key: string]: string } = {
  green: "border-emerald-500",
  red: "border-red-600",
  blue: "border-blue-300",
};

const displayType: { [key: string]: string } = {
  row: "flex-row",
  column: "flex-col",
};

const ItemDisplay = ({
  itemsIds,
  style,
}: {
  itemsIds: { id: string }[] | undefined;
  style: ItemDisplayStyle;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [visible, setVisible] = useState(true);

  const allData: Item[] = [];

  // Conseguir todos los items, a partir de los ids
  itemsIds?.map((item) => {
    let nextItem: Item | null | undefined;

    const { data: articulo } = api.general.getItemById.useQuery(item);

    if (articulo !== undefined && articulo !== null) {
      allData?.push(articulo);
    }
  });

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput((e.target as HTMLInputElement).value);
  };

  let it: Item[] | undefined;

  // Todo: Cambiar esto para que se haga de manera efectiva.
  if (searchInput.length > 0) {
    const search = searchInput.toLowerCase();
    it = allData?.filter((item) => {
      // Filtrar usando atributos de item
      return (
        item.name?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.imgPath?.toLowerCase().includes(search) ||
        item.department?.toLowerCase().includes(search)
      );
    });
  } else {
    it = allData;
  }

  return (
    <div className="m-4">
      <h1 className="mb-0 w-full basis-full pb-0 text-center text-4xl font-bold text-white">
        {style?.title}
      </h1>

      {visible && (
        <input
          className="w-[80%] basis-full rounded-md bg-slate-500 px-4 py-2 text-white"
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder={style?.placeHolder ? style.placeHolder : "Buscar..."}
        />
      )}

      {visible ? (
        <AiFillEyeInvisible
          className="inline h-10 w-[20%]"
          onClick={() => setVisible(false)}
        />
      ) : (
        <AiFillEye
          className="block h-10 w-[100%] text-center"
          onClick={() => setVisible(true)}
        />
      )}

      {visible && (
        <div
          className={`${
            displayType[style.type]
          } flex flex-wrap items-center justify-between rounded-md border-8 ${
            colorVariants[style.color]
          } `}
        >
          {it?.map((item, id) => {
            return BlurImageItem({ item, type: style?.type });
          })}
        </div>
      )}
    </div>
  );
};

export default ItemDisplay;
export type { ItemDisplayStyle };
