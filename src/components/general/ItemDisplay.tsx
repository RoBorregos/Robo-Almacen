import { Item } from "@prisma/client";
import React, { useState } from "react";
import BlurImage from "./BlurImage";

// Interace to personalize display of component
interface ItemDisplayStyle {
  columns: number;
  type: string;
  title: string;
  color: string;
  placeHolder?: string;
  width: string;
}

const ItemDisplay = ({
  items,
  style,
}: {
  items: Item[] | undefined;
  style: ItemDisplayStyle;
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput((e.target as HTMLInputElement).value);
  };

  let it: Item[] | undefined;

  if (searchInput.length > 0) {
    it = items?.filter((item) =>
      item.name?.toLowerCase().includes(searchInput.toLowerCase())
    );
  } else {
    it = items;
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

  return (
    <div className="m-4">
      <h1 className="mb-0 w-full basis-full pb-0 text-center text-4xl font-bold text-white">
        {style?.title}
      </h1>
      <input
        className="placeholder: w-full basis-full rounded-md bg-slate-500 px-4 py-2 text-white"
        type="text"
        value={searchInput}
        onChange={handleSearch}
        placeholder={style?.placeHolder ? style.placeHolder : "Buscar..."}
      />

      <div
        className={`${
          displayType[style.type]
        } flex flex-wrap items-center justify-between rounded-md border-8 ${
          colorVariants[style.color]
        } `}
      >
        {it?.map((item, id) => BlurImage({ item, type: style?.type }))}
      </div>
    </div>
  );
};

export default ItemDisplay;
export type { ItemDisplayStyle };
