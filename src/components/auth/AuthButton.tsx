import { signIn } from "next-auth/react";

const AuthButton: React.FC = () => {

  return (
    <button
      className="font-inter mr-12 rounded-lg border bg-blue-700 px-4 py-1 text-gray-100 transition duration-300 hover:bg-blue-800"
      onClick={() => void signIn()}
    >
      Sign in
    </button>
  );
};

export default AuthButton;
