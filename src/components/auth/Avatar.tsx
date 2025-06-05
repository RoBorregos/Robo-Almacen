import Image from 'next/image';
interface AvatarProps {
    image: string;
}

function Avatar({ image }: AvatarProps) {
    return (
	<>
	    <div
		id="avatarMenu"
		className="relative overflow-hidden rounded-sm h-11 w-11">
		<Image
		    fill
		    src={image}
		    alt="Self profile picture"
		    className="object-cover cursor-pointer"/>
	    </div>
	</>
    )
}

export default Avatar;
