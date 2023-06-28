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

const ItemDisplay = ({ style }: { style: ItemDisplayStyle }) => {
  const [searchInput, setSearchInput] = useState("");
  const [visible, setVisible] = useState(true);

  const { data: items, isLoading } = api.general.getItemsSearch.useQuery({
    search: searchInput,
  });
  // return (
  //   <div className="m-4">
  //     e
  //     </div>
  // );

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
          onChange={(e) => setSearchInput(e.target.value)}
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
      
      {(!isLoading && visible) && (
        <div
          className={`${
            displayType[style.type]
          } flex flex-wrap items-center justify-between rounded-md border-8 ${
            colorVariants[style.color]
          } `}
        >
          {items?.map((item, id) => {
            return BlurImageItem({ item: item, type: style?.type });
          })}
        </div>
      )}
    </div>
  );
};

export default ItemDisplay;
export type { ItemDisplayStyle };
