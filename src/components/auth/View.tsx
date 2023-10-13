import { api } from "rbgs/utils/api";
import ViewElement from "./ViewElement";
import Avatar from "./Avatar";
import User from "./User";

interface ViewProps {
    handleClick: () => void;
    userId: string;
}

const View: React.FC<ViewProps> = ({ handleClick, userId }) => {
    
    const { data } = api.userData.getUserData.useQuery({
        id: userId,
    });


    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Avatar image={data?.image || 'Logo2.svg'}/>
            <User />
            <div className="flex flex-col items-start justify-center gap-4 mt-4">
                <ViewElement label="Major" value={data?.major || ''} />
                <ViewElement label="Semester" value={data?.semester || 0} />
                <ViewElement label="Phone" value={data?.phone || ''} />
                <ViewElement label="Area" value={data?.area || ''} />
            </div>
            <button className="rounded-md bg-blue-500 px-7 py-1 text-white self-end" onClick={handleClick}>
                Edit
            </button>
        </div>
    )
}

export default View;