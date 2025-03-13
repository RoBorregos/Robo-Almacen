import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import { useState } from "react";
import Link from "next/link";
import { Item } from "@prisma/client";

const DropDown = ({
  current,
  listItems,
}: {
  current: string | undefined;
  listItems: ({id: string, name:string})[] | undefined;
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  return (
    <div className="relative my-4 inline rounded-md bg-slate-500 pl-8 pr-2 text-base lg:pb-4 lg:pl-12 lg:text-lg">
      {open ? (
        <IoIosArrowDropup
          onClick={handleToggle}
          className="absolute left-1 top-1 text-lg lg:text-4xl"
        />
      ) : (
        <IoIosArrowDropdown
          onClick={handleToggle}
          className="absolute left-1 top-1 text-lg lg:text-4xl"
        />
      )}
      {current}

      {open &&
        listItems?.map((item, id) => (
          <Link
            href={`/dashboard/${item.id}`}
            key={id}
            className="duration-300 block px-4 py-2 text-sm text-white hover:bg-slate-400"
          >
            <li>{item.name}</li>
          </Link>
        ))}
    </div>
  );
};

export default DropDown;
