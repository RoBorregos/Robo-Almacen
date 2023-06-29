import logo from './public/Letras.png';

const color = "text-slate-950 hover:text-sky-800";

const NavBar = ({
  routes,
}: {
  routes: { name: string; path: string }[];
}) => {
  return (
    <div className="w-full bg-sky-100 h-16 flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex mb-0">
          <ul className="flex items-center">
          <img src="/Logo2.svg" alt="Logo" style={{ width: "70px", height: "50px" }}/>
          <img src="/Letras.png" alt ="Letras" style={{ width: "180px", height: "30px" }} mr-16/>
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
      <div className="flex-1 flex justify-end items-center">
        <div className="flex justify-center">
          <button className="bg-blue-500 mr-12 hover:bg-blue-600 bg-opacity-80 text-gray-100 font-inter py-1 px-4 border rounded ">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
