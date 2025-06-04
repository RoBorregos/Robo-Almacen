import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
import Image from "next/image";
import AuthButton from "../auth/AuthButton";
import Avatar from "../auth/Avatar";

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

    const [userMenuState, setUserMenuState] = useState(false); // menu state (dropdown)

    function clickHandler(event: MouseEvent)
    {
	    const target = event.target as HTMLInputElement;
	    const dropdown = document.getElementById("userMenu");
	    const avatarMenu = document.getElementById("avatarMenu")
	    if(dropdown && !dropdown.classList.contains('hidden') && !avatarMenu!.contains(target)) setUserMenuState(false);
    }
    // Hook into document root JS
    useEffect(() => {
	document.addEventListener("click", clickHandler);
    }, []);

    return (
	<div className="grid h-16 w-full grid-cols-3 justify-evenly px-10 font-mono">
	    <div className="flex items-center justify-center">
		<Image
		    src="/Logo2.svg"
		    alt="Logo"
		    width= {70}
		    height= {50}
		/>
		<Image
		    src="/Letras.png"
		    alt="Letras"
		    width= {180}
		    height= {30}
		/>
	    </div>
	    <div className="flex items-center justify-center">
		<div className="mb-0 flex">
		    <ul className="flex items-center">
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
	    <div className="flex items-center justify-center">
		<div className="flex justify-center relative">
		    {sessionData ? Avatar({image: sessionData.user.image!, state: userMenuState, stateSetter: setUserMenuState}) : AuthButton({})}
		</div>
	    </div>
	</div>
    );
};

export default NavBar;
