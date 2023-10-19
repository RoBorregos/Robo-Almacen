import { type NextPage } from "next";
import { useState } from "react";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { CardContainer } from "rbgs/components/card/CardContainer";
import { ItemCard } from "rbgs/components/card/ItemCard";
import ItemDisplay, {
  ItemDisplayStyle,
} from "rbgs/components/dashboard/ItemDisplay";

// import { generateNPrestamos } from "rbgs/utils/generateData";
import PrestamoDisplay from "rbgs/components/dashboard/PrestamoDisplay";
import { useSession } from "next-auth/react";
import { PrestamoCard } from "rbgs/components/card/PrestamoCard";

// TODO:
// Añadir callbacks en componentes de Items.
// Hacer diseño responsivo con media queries.

const Dashboard: NextPage = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-white">
          Inicia sesión para acceder a esta página
        </h1>
      </Layout>
    );
  }

  const [display, setDisplay] = useState("items");

  return (
    <Layout>
      <div className="flex flex-col ">
        <div className="my-2 flex flex-row justify-center space-x-3">
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => setDisplay("items")}
          >
            Items
          </button>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => setDisplay("prestamos")}
          >
            Prestamos
          </button>
          <button
            className="rounded-md bg-blue-500 px-4 py-2 text-white"
            onClick={() => setDisplay("historial")}
          >
            Historial
          </button>
        </div>
        <PageContent display={display} />
      </div>
    </Layout>
  );
};

const PageContent = ({ display }: { display: string }) => {
  if (display === "items") return <ItemContainer />;
  if (display === "historial") return <HistorialContainer />;
  if (display === "prestamos") return <PrestamoContainer />;
  return <p>Error, invalid display type</p>;
};

const ItemContainer = ({ search }: { search?: string }) => {
  const { data: itemId, isLoading } = api.items.getItemsId.useQuery({
    search: search ?? "",
  });

  return (
    <CardContainer>
      {itemId?.map((item, id) => (
        <ItemCard id={item.id} key={id} />
      ))}
    </CardContainer>
  );
};

const HistorialContainer = ({ search }: { search?: string }) => {
  const { data: prestamoIDs } = api.prestamos.getPrestamosId.useQuery({
    search: search ?? "",
    type: "inactivo",
  });

  return (
    <CardContainer>
      {prestamoIDs?.map((prestamo, id) => (
        <PrestamoCard id={prestamo.id} showUser={true} key={id} />
      ))}
    </CardContainer>
  );
};
const PrestamoContainer = ({ search }: { search?: string }) => {
  const { data: prestamoIDs } = api.prestamos.getPrestamosId.useQuery({
    search: search ?? "",
    type: "activo",
  });

  return (
    <CardContainer>
      {prestamoIDs?.map((prestamo, id) => (
        <PrestamoCard id={prestamo.id} showUser={true} key={id} />
      ))}
    </CardContainer>
  );
};

export default Dashboard;
