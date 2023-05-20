import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";
import { useState } from "react";

const Home: NextPage = () => {
  const utils = api.useContext();
  const { data: Saludo, isLoading } = api.example.hello.useQuery({
    text: "RoBorregos",
  });
  const { mutate, mutateAsync } = api.example.crear.useMutation();
  const { data: ejemplos } = api.example.getAll.useQuery();
  const [texto, setTexto] = useState("place holder");

  const handleCrear = async () => {
    const asd = await mutateAsync({ name: texto });
    void utils.example.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">
          Almacén 🥵
        </h1>
        {isLoading ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          <p className="text-center text-2xl text-white">{Saludo?.greeting}</p>
        )}
        <input
          className="rounded-md bg-white/10 px-4 py-2 text-black"
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={void handleCrear()}
        >
          crear ejemplo
        </button>
        {ejemplos?.map((ejemplo, id) => (
          <p className="text-center text-2xl text-white" key={id}>
            {ejemplo.name}
          </p>
        ))}
        <AuthShowcase />
      </div>
    </Layout>
  );
};

export default Home;
