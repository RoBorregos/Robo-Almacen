import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";
import { useState } from "react";
import ExButton from "rbgs/components/buttons/ExButton";
import { useRef } from "react";

const modal: NextPage = () => {
  const utils = api.useContext();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: Saludo, isLoading } = api.example.hello.useQuery({
    text: "Almacen",
  });


  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-8">
      <dialog ref = {dialogRef} id ="popup" className = "bg-blue-400 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full">
        <p className="text-center text-2xl font-bold text-white">
         Registrar locker
        </p>
        <input
          className="rounded-md bg-white/10 px-8 py-2 text-white"
          type="text"
        />
        <ExButton 
            onClick={()=>{dialogRef?.current?.close()}}
        > 
          Cerrar
        </ExButton>
        <ExButton 
            onClick={()=>{dialogRef?.current?.close()}}
        > 
          Guardar
        </ExButton>
        </dialog>
      <h1 className="text-4xl font-bold text-white">
          EJEMPLO PARA EL MODAL
        </h1>
        {isLoading ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          <p className="text-center text-2xl text-white">{Saludo?.greeting}</p>
        )}
        <ExButton 
            onClick={()=>{dialogRef?.current?.show()}}
        > 
          Abrir
        </ExButton>
      </div>
    </Layout>
  );
};

export default modal;