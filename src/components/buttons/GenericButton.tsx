import * as React from "react";

const GenButton = ({
  title = "Boton",
  color = "red",
  size = "medium",
  className = "",
}: {
  title?: string;
  color?: string;
  size?: string;
  className?: string;
}) => {
  const colorVariants: { [key: string]: string } = {
    green: "bg-green-400 hover:bg-green-700 text-white",
    red: "bg-red-400 hover:bg-red-700 text-white",
    blue: "bg-blue-400 hover:bg-blue-700 text-white",
    violet: "bg-white border-violet-400 hover:border-violet-700 text-black border-2",
  };

  const sizeVariants: { [key: string]: string } = {
    small: "w-1/4 text-xs",
    medium: "w-1/3 text-xl",
    large: "w-1/2 text-base",
  };

  return (
    <div>
      <button
        className={`${colorVariants[color]} ${sizeVariants[size]} align-middle rounded-full font-bold duration-300 ${className}`}
      >
        {title}
      </button>
    </div>
  );
};

export default GenButton;
