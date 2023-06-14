import { MouseEventHandler, ReactNode } from "react";

const ExButton = ({onClick, children}: {onClick?: MouseEventHandler<HTMLButtonElement>, children: ReactNode}) => {

return (
<button
  popovertarget ="popup"
  className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
  onClick={onClick}\
  >
    {children}
</button>
);
};

export default ExButton;