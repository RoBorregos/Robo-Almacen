import { env } from "../../env.mjs";
import { useState, useEffect } from "react";
import { isImgUrl } from "../../utils/image";
import { twMerge } from "tailwind-merge";

export const HorizontalGeneralCard = ({
  children,
  title = "Card",
  imageLink,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  imageLink?: string;
  className?: string;
}) => {
  // Add image validation
  const [imageUrl, setimageUrl] = useState(env.NEXT_PUBLIC_DEFAULT_IMAGE);

  useEffect(() => {
    const fetchImg = async () => {
      if (imageLink) {
        const isValid = await isImgUrl(imageLink);
        if (isValid) {
          setimageUrl(imageLink);
        } else {
          console.log("Invalid image url:", imageLink);
        }
      }
    };
    void fetchImg();
  }, [imageLink]);

  return (
    <a
      className={twMerge(
        "flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:flex-row",
        className
      )}
    >
      <img
        className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={imageUrl}
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        {children}
      </div>
    </a>
  );
};
