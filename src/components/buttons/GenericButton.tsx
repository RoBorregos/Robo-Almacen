import * as React from "react";

const GenButton = ({
  title = "Boton",
  color = "red",
  size = "medium",
  className = "",
  onclick = () => {console.log("Clicked button!");},
}: {
  title?: string;
  color?: string;
  size?: string;
  className?: string;
  onclick?: () => void;
}) => {
  const colorVariants: { [key: string]: string } = {
    green: "bg-green-400 hover:bg-green-700 text-white",
    red: "bg-red-400 hover:bg-red-700 text-white",
    blue: "bg-blue-400 hover:bg-blue-700 text-white",
    violet:
      "bg-white border-violet-400 hover:border-violet-700 text-black border-2",
  };

  const sizeVariants: { [key: string]: string } = {
    small: "text-xs",
    medium: "text-base",
    large: "text-xl",
  };

  return (
    <div>
      <button
        onClick={onclick}
        className={`${colorVariants[color]} ${sizeVariants[size]} rounded-full p-3 align-middle font-bold duration-300 ${className}`}
      >
        {title}
      </button>
    </div>
  );
};

export default GenButton;
