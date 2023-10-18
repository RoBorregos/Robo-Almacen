import { api } from "rbgs/utils/api";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import React, { useState } from "react";
import BlurImagePrestamo from "./BlurImagePrestamo";
import { ItemDisplayStyle } from "./ItemDisplay";

const colorVariants: { [key: string]: string } = {
  green: "border-emerald-500",
  red: "border-red-600",
  blue: "border-blue-300",
};

const displayType: { [key: string]: string } = {
  row: "flex-row",
  column: "flex-col",
};

const PrestamoDisplay = ({
  type = "activo",
  style,
}: {
  type: string;
  style: ItemDisplayStyle;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [visible, setVisible] = useState(true);

  const { data: prestamos, isLoading } = api.prestamos.getPrestamosId.useQuery({
    search: searchInput,
    type: type,
  });

  return (
    <div className="m-4">
      <h1 className="w-full text-center text-4xl font-bold text-white">
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
      {!isLoading && visible && (
        <div
          className={`${
            displayType[style.type]
          } flex flex-wrap items-center justify-between rounded-md border-8 ${
            colorVariants[style.color]
          } `}
        >
          {prestamos?.map((prestamo) => (
            <BlurImagePrestamo idPrestamo={prestamo.id} type={style?.type} key={prestamo.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrestamoDisplay;
