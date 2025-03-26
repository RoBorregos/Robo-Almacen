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

  const buttons = ["activos", "inactivos"];
  const [display, setDisplay] = useState(buttons[0] ?? "");
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
          {buttons.map((buttonType) => (
            <button
              key={buttonType}
              className={`rounded-md bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800 ${
                display === buttonType ? "bg-blue-800" : ""
              }`}
              onClick={() => setDisplay(buttonType)}
            >
              Préstamos {buttonType}
            </button>
          ))}
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
  if (display === "activos")
    return <PrestamoContainer search={searchText} active={true} />;
  if (display === "inactivos")
    return <PrestamoContainer search={searchText} active={false} />;
  return <p>Error, invalid display type</p>;
};

const PrestamoContainer = ({
  search,
  active,
}: {
  search?: string;
  active: boolean;
}) => {
  const { data: prestamoIDs } = api.prestamos.getActivePrestamosIds.useQuery({
    search: search ?? "",
    active: active,
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
