import * as React from "react";
import GenButton from "../buttons/GenericButton";
import { api } from "rbgs/utils/api";
import { isImgUrl } from "../../utils/image";
import { useEffect, useState } from "react";
import { env } from "../../env.mjs";
import { twMerge } from "tailwind-merge";

const displayType: { [key: string]: string } = {
  row: "h-1/3 w-1/3",
  column: "aspect-square",
};

const BlurImageItem = ({
  itemId,
  type = "column",
}: {
  itemId: string;
  type?: string;
}) => {
  const { data: item } = api.items.getItemById.useQuery({
    id: itemId,
  });
  const [imageUrl, setimageUrl] = useState(env.NEXT_PUBLIC_DEFAULT_IMAGE);

  useEffect(() => {
    const fetchImg = async () => {
      if (item?.imgPath) {
        const isValid = await isImgUrl(item.imgPath);
        if (isValid) {
          setimageUrl(item.imgPath);
        } else {
          console.log("Invalid image url:", item.imgPath);
        }
      }
    };
    void fetchImg();
  }, [item?.imgPath]);

  return (
    <div
      className={twMerge("group/item relative", displayType[type])}
      key={item?.id}
    >
      <img
        className="aspect-square opacity-100 duration-300 hover:opacity-80"
        src={imageUrl}
        alt={item?.name}
        key={item?.name}
      />
      <h1 className="absolute top-0 h-1/6 w-full bg-black/50 text-center text-white opacity-0 duration-300 group-hover/item:opacity-100">
        {item?.name}
      </h1>
      <GenButton
        title="Más información"
        className="absolute bottom-2 left-2 opacity-0 duration-300 group-hover/item:opacity-100"
      />
      <GenButton
        color="violet"
        title="Pedir"
        className="absolute bottom-2 right-2 opacity-0 duration-300 group-hover/item:opacity-100"
      />
    </div>
  );
};

export default BlurImageItem;
