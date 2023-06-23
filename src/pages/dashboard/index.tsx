import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";
import { useState } from "react";
import StickyHeadTable from "rbgs/components/general/ListDisplay";
import ItemDisplay, {
  ItemDisplayStyle,
} from "rbgs/components/general/ItemDisplay";

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
  const utils = api.useContext();
  const { data: articulos, isLoading } = api.general.getAllItems.useQuery();

  // Copia temporal de los articulos
  let arts;
  if (articulos !== undefined) {
    arts = [...articulos];
    arts?.map((articulo) => {
      return arts.push(articulo);
    });
  }

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">Dashboard Principal</h1>

        {isLoading ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          <div className="flex basis-8/12 flex-row flex-wrap justify-around">
            <div className="basis-8/12 flex-col">
              <div className="w-full items-center justify-center gap-4">
                <ItemDisplay items={arts} style={activos} />
              </div>
              <div className="items-center justify-center gap-4">
                <ItemDisplay items={articulos} style={inventario} />
              </div>
            </div>
            <div className="basis-4/12">
              <ItemDisplay items={articulos} style={historial} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
