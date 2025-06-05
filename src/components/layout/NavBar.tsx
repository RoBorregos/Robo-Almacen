import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "../auth/AuthButton";
import Avatar from "../auth/Avatar";
import { allowedRole } from "rbgs/utils/roles";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "rbgs/components/ui/dropdown-menu"

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
				<Link className={color} href={route.path}>
				    {route.name}
				</Link>
			    </li>
			))}
		    </ul>
		</div>
	    </div>
	    <div className="flex items-center justify-center">
		<div className="flex justify-center relative">
		    {sessionData ?
			<DropdownMenu>
			    <DropdownMenuTrigger>{
				Avatar({image: sessionData.user.image!})}
			    </DropdownMenuTrigger>
			    <DropdownMenuContent align='start'>
				<DropdownMenuItem>
				    <Link
					href="/profile">
					Profile
				    </Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator/>
				<DropdownMenuItem>
				    <a onClick={() => void signOut()}>
					Sign out
				    </a>
				</DropdownMenuItem>
			    </DropdownMenuContent>
			</DropdownMenu>:
			AuthButton({})
		    }
		</div>
	    </div>
	</div>
    );
};

export default NavBar;
