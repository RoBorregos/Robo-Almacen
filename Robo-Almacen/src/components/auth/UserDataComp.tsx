import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import View from "./View";
import AuthForm from "./AuthForm";

type Variant = "EDIT" | "VIEW";

const UserDataComp: React.FC = () => {
    const [variant, setVariant] = useState<Variant>("VIEW");
    const { data: sessionData } = useSession();
    const userId = sessionData?.user.id;

    
    

    const toggleVariant = useCallback(() => {
        if (variant == 'VIEW') {
            setVariant('EDIT');
        } else {
            setVariant('VIEW');
        }
    }, [variant]);

    return (
        <>
            {variant == 'VIEW' ? (
                <View handleClick={() => toggleVariant()} userId={userId || "-1"} />
            ) : (
                <AuthForm onSubmit={() => toggleVariant()} userId={userId || "-1"} />
            )}
        </>
    )
}

export default UserDataComp;