import Image from 'next/image';
import Dropdown from '../layout/Dropdown';
interface AvatarProps {
    image: string;
    state?: boolean;
    stateSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}

function Avatar({ image, state, stateSetter }: AvatarProps) {
    return (
	<>
	    <div
		id="avatarMenu"
		className="relative overflow-hidden rounded-sm h-11 w-11"
	    >
                <Image
		    fill
		    src={image}
		    alt="Avatar"
		    className="object-cover cursor-pointer"
		    onClick={stateSetter ? () => stateSetter(!state) : () => console.log('No action set.')}
		/>
            </div>
	    <div
		className={`${state ? "flex" : "hidden"}`}
		id = "userMenu"
	    >
		<Dropdown />
	    </div>
        </>
    )
}

export default Avatar;
