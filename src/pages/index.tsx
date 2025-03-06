import { type NextPage } from "next";
import { useState } from "react";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { CardContainer } from "rbgs/components/card/CardContainer";
import { ItemCard } from "rbgs/components/card/ItemCard";

import { useSession } from "next-auth/react";
import { PrestamoCard } from "rbgs/components/card/PrestamoCard";
import { SearchBar } from "rbgs/components/search/SearchBar";
import { Session } from "next-auth";

// TODO:
// Añadir callbacks en componentes de Items.
// Hacer diseño responsivo con media queries.

const Dashboard: NextPage = () => {
  const { data, status } = useSession();

  const [display, setDisplay] = useState("items");
  const [searchText, setSearchText] = useState("");

  if (status === "unauthenticated") {
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-white">
          Inicia sesión para acceder a esta página.
        </h1>
      </Layout>
    );
  }

  return (
    <Layout className="justify-start">
      <div className="mt-3 flex w-full flex-col justify-start">
        <div className="my-5 flex w-full flex-row flex-wrap justify-center space-x-3">
          <button
            className={`rounded-md bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800 ${
              display === "items" ? "bg-blue-800" : ""
            }`}
            onClick={() => setDisplay("items")}
          >
            Items
          </button>
          <button
            className={`rounded-md bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800 ${
              display === "prestamos" ? "bg-blue-800" : ""
            }`}
            onClick={() => setDisplay("prestamos")}
          >
            Préstamos
          </button>
          <button
            className={`rounded-md bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800 ${
              display === "historial" ? "bg-blue-800" : ""
            }`}
            onClick={() => setDisplay("historial")}
          >
            Historial
          </button>
          <div className="w-6/12">
            <SearchBar setUpdateSearch={setSearchText} />
          </div>
        </div>
        <PageContent searchText={searchText} display={display} data={data} />
      </div>
    </Layout>
  );
};

const PageContent = ({
  display,
  searchText,
  data,
}: {
  display: string;
  searchText: string;
  data: Session | null;
}) => {
  if (display === "items")
    return <ItemContainer search={searchText} data={data} />;
  if (display === "historial")
    return <HistorialContainer search={searchText} />;
  if (display === "prestamos") return <PrestamoContainer search={searchText} />;
  return <p>Error, invalid display type</p>;
};

const ItemContainer = ({
  search,
  data,
}: {
  search?: string;
  data: Session | null;
}) => {
  const { data: itemId } =
    data?.user.role === "ADMIN" || !data
      ? api.items.getAvailableItemIds.useQuery({
          search: search ?? "",
        })
      : api.items.getItemsInUsersGroup.useQuery({
          search: search ?? "",
          userId: data.user.id,
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
        <PrestamoCard id={prestamo.id} showUser={false} key={id} />
      ))}
    </CardContainer>
  );
};

export default Dashboard;
