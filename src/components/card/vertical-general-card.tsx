"use client";

import type React from "react";
import { env } from "../../env.mjs";
import { useState, useEffect } from "react";
import { isImgUrl } from "../../utils/image";
import { twMerge } from "tailwind-merge";
import { Card, CardContent, CardHeader } from "src/components/ui/card";

interface VerticalGeneralCardProps {
  children: React.ReactNode;
  title?: string;
  imageLink?: string;
  className?: string;
}

export const VerticalGeneralCard = ({
  children,
  title = "Card",
  imageLink,
  className,
}: VerticalGeneralCardProps) => {
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
    <Card
      className={twMerge(
        "overflow-hidden transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
          <img
            className="h-full w-full object-contain p-3 transition-transform duration-200 hover:scale-105"
            src={imageUrl || "/placeholder.svg"}
            alt={title}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-6">
        {title && (
          <h3 className="mb-4 text-center text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        <div className="flex-1">{children}</div>
      </CardContent>
    </Card>
  );
};
