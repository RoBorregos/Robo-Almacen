import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import ItemDisplay, {
  ItemDisplayStyle,
} from "rbgs/components/dashboard/ItemDisplay";

// import { generateNPrestamos } from "rbgs/utils/generateData";
import PrestamoDisplay from "rbgs/components/dashboard/PrestamoDisplay";
import { useSession } from "next-auth/react";

// TODO:
// Añadir callbacks en componentes de Items.
// Hacer diseño responsivo con media queries.

const activos: ItemDisplayStyle = {
  columns: 1,
  title: "Pedidos Activos",
  color: "red",
  placeHolder: "Buscar activos...",
  width: "4",
  type: "row",
};
const inventario: ItemDisplayStyle = {
  columns: 1,
  title: "Pedir",
  color: "green",
  placeHolder: "Pedir Nuevo...",
  width: "4",
  type: "row",
};
const historial: ItemDisplayStyle = {
  columns: 1,
  title: "Historial",
  color: "blue",
  placeHolder: "Buscar...",
  width: "4",
  type: "column",
};

const Dashboard: NextPage = () => {
  const { status } = useSession();

  if (status === "unauthenticated"){
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-white">Inicia sesión para acceder a esta página</h1>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">Dashboard Principal</h1>
        <div className="flex basis-8/12 flex-row flex-wrap justify-around">
          <div className="basis-8/12 flex-col">
            <div className="w-full items-center justify-center gap-4">
              <PrestamoDisplay type="activo" style={activos} />
            </div>
            <div className="items-center justify-center gap-4">
              <ItemDisplay style={inventario} />
            </div>
          </div>
          <div className="basis-4/12">
            <PrestamoDisplay type="inactivo" style={historial} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
