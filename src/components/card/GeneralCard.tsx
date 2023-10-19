import { env } from "../../env.mjs";
import { useState, useEffect } from "react";
import { isImgUrl } from "../../utils/image";

export const GeneralCard = ({
  children,
  title = "Card",
  imageLink,
}: {
  children: React.ReactNode;
  title?: string;
  imageLink?: string;
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
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <a href="#">
        <img className="rounded-t-lg" src={imageUrl} alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </a>
        {children}
      </div>
    </div>
  );
};
