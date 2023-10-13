import { useSession } from "next-auth/react";


const User: React.FC = () => {
    const { data: sessionData } = useSession();
    
    return (
        <div className="flex flex-col items-center justify-center gap-2 mb-5">
            <h1 className="text-center text-2xl font-bold text-white">
                {sessionData && <span>{sessionData.user?.name}</span>}
            </h1>
            <p>
                {sessionData && <span> {sessionData.user?.email}</span>}
            </p>

        </div>
    );
};

export default User;