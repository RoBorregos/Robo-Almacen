import { useSession } from "next-auth/react";
import { api } from "rbgs/utils/api";
import AuthButton from "rbgs/components/auth/AuthButton";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const { data: memberMessage } = api.example.getMemberMessage.useQuery();
  const { data: adminMessage } = api.example.getAdminMessage.useQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <p className="text-center text-2xl text-white">
        {secretMessage && <span>{secretMessage}</span>}
      </p>

      <p className="text-center text-2xl text-white">
        {memberMessage && <span>{memberMessage}</span>}
      </p>

      <p className="text-center text-2xl text-white">
        {adminMessage && <span>{adminMessage}</span>}
      </p>

      <AuthButton />
    </div>
  );
};

export default AuthShowcase;
