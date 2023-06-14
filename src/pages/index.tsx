import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";
import { useState } from "react";
import ExButton from "rbgs/components/buttons/ExButton";


const Home: NextPage = () => {
  const utils = api.useContext();
  const { data: Saludo, isLoading } = api.example.hello.useQuery({
    text: "RoBorregos",
  });
  const { mutateAsync } = api.example.crear.useMutation();
  const { data: ejemplos } = api.example.getAll.useQuery();
  const [texto, setTexto] = useState("¿Cuál locker ocupas abrir?");
  const [texto2, setTexto2] = useState("¿Para qué competencia?");
  const handleCrear = async () => {
    const asd = await mutateAsync({ name: texto });
    await utils.example.getAll.invalidate();
  };
  const handleCrear2 = async () => {
    const abc = await mutateAsync({ name: texto2 });
    await utils.example.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-white">
          LOCKERS FOR COMPETITION
        </h1>
        <h1 className="text-center text-4xl font-bold text-white">
          Probando
        </h1>
        {isLoading ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          <p className="text-center text-2xl text-white">{Saludo?.greeting}</p>
        )}
        <input
          className="rounded-md bg-white/10 px-4 py-2 text-white"
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <input
          className="rounded-md bg-white/10 px-8 py-2 text-white"
          type="text"
          value={texto2}
          onChange={(e) => setTexto2(e.target.value)}
        />
        <ExButton 
        onClick = {() => void handleCrear2()}
        > 
          Registrar
        </ExButton>
        <button
          className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
          onClick={() => void handleCrear()}
        >
          Agregar
        </button>
        {ejemplos?.map((ejemplo, id) => (
          <p className="text-center text-2xl text-white" key={id}>
            {ejemplo.name}
          </p>
        ))}
        <AuthShowcase/>
      </div>
    </Layout>
  );
};

export default Home;
