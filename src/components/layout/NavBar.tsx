import logo from './public/Letras.png';
import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";

const color = "text-slate-950 hover:text-sky-800";

const NavBar = ({
  routes,
}: {
  routes: { name: string; path: string }[];
}) => {
  const { data: sessionData } = useSession();

  return (
    <div className="w-full h-16 grid grid-cols-3 px-10 justify-evenly font-mono">
      {/* Left logos */}
      <div className='flex items-center justify-center'>
        <img src="/Logo2.svg" alt="Logo" style={{ width: "70px", height: "50px" }}/>
        <img src="/Letras.png" alt ="Letras" style={{ width: "180px", height: "30px" }}/>
      </div>
      {/* Center letters */}
      <div className="flex items-center justify-center">
        <div className="flex mb-0">
          <ul className="flex items-center text-lg">
            {routes.map((route) => (
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
      <div className="flex justify-end items-center">
        <div className="flex justify-center">
          <button 
          onClick={sessionData ? () => void signOut() : () => void signIn()}
          className="bg-blue-700 mr-12 transition duration-300 hover:bg-blue-800 text-gray-100 font-inter py-1 px-4 border rounded-lg">
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
