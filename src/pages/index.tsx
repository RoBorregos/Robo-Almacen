import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">
          Almacén 🥵
        </h1>
        <p className="text-center text-2xl text-white">Hola</p>
        <AuthShowcase />
      </div>
    </Layout>
  );
};

export default Home;
