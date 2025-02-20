import logo from "./public/Letras.png";
import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";

import { allowedRole } from "rbgs/utils/roles";

const color = "text-slate-950 hover:text-sky-800";

const NavBar = ({
  routes,
}: {
  routes: { name: string; path: string; roles?: string[] }[];
}) => {
  const { data: sessionData } = useSession();

  const filteredRoutes = routes.filter((route) => {
    if (route.roles) {
      return allowedRole({
        role: sessionData?.user.role,
        allowed: route.roles,
      });
    }
    return true;
  });

  return (
    <div className="grid h-16 w-full grid-cols-3 justify-evenly px-10 font-mono">
      {/* Left logos */}
      <div className="flex items-center justify-center">
        <img
          src="/Logo2.svg"
          alt="Logo"
          style={{ width: "70px", height: "50px" }}
        />
        <img
          src="/Letras.png"
          alt="Letras"
          style={{ width: "180px", height: "30px" }}
        />
      </div>
      {/* Center letters */}
      <div className="flex items-center justify-center">
        <div className="mb-0 flex">
          <ul className="flex items-center">
            <img
              src="/Logo2.svg"
              alt="Logo"
              style={{ width: "70px", height: "50px" }}
            />
            <img
              src="/Letras.png"
              alt="Letras"
              style={{ width: "180px", height: "30px" }}
            />
            {filteredRoutes.map((route) => (
              <li className="mr-6 inline-block" key={route.name}>
                <a className={color} href={route.path}>
                  {route.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Right account buttons */}
      <div className="flex items-center justify-end">
        <div className="flex justify-center">
          <button
            onClick={sessionData ? () => void signOut() : () => void signIn()}
            className="font-inter mr-12 rounded-lg border bg-blue-700 px-4 py-1 text-gray-100 transition duration-300 hover:bg-blue-800"
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
