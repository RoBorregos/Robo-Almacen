import { signOut } from "next-auth/react";

// From https://tailwindcss.com/plus/ui-blocks/application-ui/elements/dropdowns

const Dropdown : React.FC = () => {
    return ( 
	<div
	    className="absolute right-10 z-10 mt-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
	    role="menu"
	>
	    <div
		className="py-1"
		role="menu-wall">
		<a
		    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
		    role="menu-item">
		    Account settings
		</a>
		<a
		    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
		    role="menui-item"
		    onClick={() => void signOut()}>
		    Sign out
		</a>
	    </div>
	</div>
    );
};
export default Dropdown;
