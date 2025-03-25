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

const Dashboard: NextPage = () => {
  const { data, status } = useSession();

  const [display, setDisplay] = useState("active-prestamos");
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

  if (data?.user.role !== "ADMIN" && data?.user.role !== "RASPI") {
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-white">
          No tienes permisos para acceder a esta página.
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
              display === "active-prestamos" ? "bg-blue-800" : ""
            }`}
            onClick={() => setDisplay("active-prestamos")}
          >
            Préstamos activos
          </button>
          <button
            className={`rounded-md bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800 ${
              display === "inactive-prestamos" ? "bg-blue-800" : ""
            }`}
            onClick={() => setDisplay("inactive-prestamos")}
          >
            Préstamos inactivos
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
  if (display === "active-prestamos")
    return <ActivePrestamoContainer search={searchText} />;
  if (display === "inactive-prestamos")
    return <InactivePrestamoContainer search={searchText} />;
  return <p>Error, invalid display type</p>;
};

const ActivePrestamoContainer = ({ search }: { search?: string }) => {
  const { data: prestamoIDs } = api.prestamos.getActivePrestamosId.useQuery({
    search: search ?? "",
  });

  return (
    <CardContainer>
      {prestamoIDs?.map((prestamo, id) => (
        <PrestamoCard id={prestamo.id} showUser={true} key={id} />
      ))}
    </CardContainer>
  );
};

const InactivePrestamoContainer = ({ search }: { search?: string }) => {
  const { data: prestamoIDs } = api.prestamos.getInactivePrestamosId.useQuery({
    search: search ?? "",
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
