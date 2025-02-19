import { type NextPage } from "next";
import { useState } from "react";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { CardContainer } from "rbgs/components/card/CardContainer";
import { ItemCard } from "rbgs/components/card/ItemCard";

import { useSession } from "next-auth/react";
import { PrestamoCard } from "rbgs/components/card/PrestamoCard";
import { SearchBar } from "rbgs/components/search/SearchBar";

const ManageUsers: NextPage = () => {
  const { status } = useSession();
  const [search, setSearch] = useState("");

  return (
    <Layout className="justify-start">
      <PageContent searchText={search} />
    </Layout>
  );
};

const PageContent = ({ searchText }: { searchText: string }) => {
  const { data: userIds } = api.userData.getUserIds.useQuery({
    search: searchText,
  });

  return (
    <div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Usuario
            </th>
            <th scope="col" className="px-6 py-3">
              Rol
            </th>
            <th scope="col" className="px-6 py-3">
              RFID
            </th>
            <th scope="col" className="px-6 py-3">
              Préstamos activos
            </th>
            <th scope="col" className="px-6 py-3">
              Total de préstamos
            </th>
          </tr>
        </thead>
        <tbody>
          {}
          <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
            <th
              scope="row"
              className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              Oscar
            </th>
            <td className="px-6 py-4">Admin</td>
            <td className="px-6 py-4">assadsa</td>
          </tr>
        </tbody>
      </table>
      <nav
        className="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row"
        aria-label="Table navigation"
      >
        <span className="mb-4 block w-full text-sm font-normal text-gray-500 md:mb-0 md:inline md:w-auto dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1-10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1000
          </span>
        </span>
        <ul className="inline-flex h-8 -space-x-px text-sm rtl:space-x-reverse">
          <li>
            <a
              href="#"
              className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="flex h-8 items-center justify-center border border-gray-300 bg-blue-50 px-3 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              4
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              5
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const ItemContainer = ({ search }: { search?: string }) => {
  const { data: itemId } = api.items.getAvailableItemIds.useQuery({
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
        <PrestamoCard id={prestamo.id} showUser={false} key={id} />
      ))}
    </CardContainer>
  );
};

export default ManageUsers;
