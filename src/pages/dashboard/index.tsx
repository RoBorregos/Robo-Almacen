import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import ItemDisplay, {
  ItemDisplayStyle,
} from "rbgs/components/dashboard/ItemDisplay";

// import { generateNPrestamos } from "rbgs/utils/generateData";
import PrestamoDisplay from "rbgs/components/dashboard/PrestamoDisplay";

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
  // const utils = api.useContext();

  const { data: inventarioIds, isLoading: isLoadingArticulos } =
    api.general.getAllItemsIds.useQuery();
  const { data: pedidosIds, isLoading: isLoadingPedidos } =
    api.general.getActivePrestamos.useQuery();
  const { data: pedidosHistorial, isLoading: isLoadingPedidosHist } =
    api.general.getHistoryPrestamos.useQuery();

  // El codigo comentado es para generar datos de prueba
  // const { mutateAsync: createUser } = api.tests.createUser.useMutation();
  // const { mutateAsync: createCelda } = api.tests.createCelda.useMutation();
  // const { mutateAsync: createItem } = api.tests.createItem.useMutation();
  // const { mutateAsync: createCeldaItem } = api.tests.createCeldaItem.useMutation();
  // const { mutateAsync: createPrestamo } = api.tests.createPrestamo.useMutation();

  // const handleCreatePrestamo = async () => {
  //   await generateNPrestamos(5, createUser, createCelda, createItem, createCeldaItem, createPrestamo)

  //   // Invalidar el cache
  //   await utils.example.getAll.invalidate();
  //   await utils.general.getAllItemsIds.invalidate();
  //   await utils.general.getActivePrestamos.invalidate();
  //   await utils.general.getHistoryPrestamos.invalidate();
  // }

  return (
    <Layout>
      {/* <button onClick={() => void handleCreatePrestamo()} className="bg-red-600 rounded-full p-4 m-4">
        Generar Datos
      </button> */}
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">Dashboard Principal</h1>

        {isLoadingArticulos && isLoadingPedidos && isLoadingPedidosHist ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          <div className="flex basis-8/12 flex-row flex-wrap justify-around">
            <div className="basis-8/12 flex-col">
              <div className="w-full items-center justify-center gap-4">
                <PrestamoDisplay itemsIds={pedidosIds} style={activos} />
              </div>
              <div className="items-center justify-center gap-4">
                <ItemDisplay itemsIds={inventarioIds} style={inventario} />
              </div>
            </div>
            <div className="basis-4/12">
              <PrestamoDisplay itemsIds={pedidosHistorial} style={historial} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
