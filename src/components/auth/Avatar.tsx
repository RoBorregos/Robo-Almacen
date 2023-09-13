import { CldUploadButton } from "next-cloudinary";
import Image from 'next/image';
import { MdModeEdit } from "react-icons/md";

interface AvatarProps {
    image: string;
    edit?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ image, edit }) => {

    return (
        <>
            {edit && (
                <div className="rounded-full h-20 w-20 absolute z-40 hover:bg-blue-950/40" />
            )}

            <div className="relative overflow-hidden rounded-full h-20 w-20 ">

                <Image fill src={image} alt="Avatar" className="object-cover" />

            </div>

            {edit && (
                <div className="relative z-50 left-2 bottom-1">
                    <MdModeEdit size={20} className="absolute bottom-0 right-0 text-white" />
                </div>
            )}

        </>
    )
}

export default Avatar;