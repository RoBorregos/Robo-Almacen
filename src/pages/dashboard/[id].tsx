import { type NextPage } from "next";
import { useRouter } from "next/router";
import DropDown from "rbgs/components/dashboard/DropDown";
import ItemCard from "rbgs/components/dashboard/ItemCard";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { useState } from "react";

const ViewPrestamo: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  const [includeReturned, setIncludeReturned] = useState(false);

  const { id } = router.query;

  const { data: item, isLoading: isLoadingItem } =
    api.general.getItemById.useQuery({ id: id as string });

  const { data: prestamos, isLoading: isLoadingPrestamo } =
    api.general.getPrestamosByItem.useQuery({
      id: id as string,
      includeReturned: includeReturned,
    });

  const { data: itemsDropDown, isLoading: isLoadingItemsD } =
    api.general.getAllItems.useQuery();

  if (isLoadingItem) {
    return (
      <Layout>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-white">Cargando...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">
          Resumen general de {item?.name}
        </h1>

        <div className="flex flex-row">
          <div className="m-4 flex flex-col">
            {isLoadingItemsD ? (
              <h1>Cargando Dropdown...</h1>
            ) : (
              <DropDown current={item?.name} listItems={itemsDropDown} />
            )}

            <label className="self-center">
              <input
                type="checkbox"
                checked={includeReturned}
                onChange={() => setIncludeReturned(!includeReturned)}
                className="mr-4"
              />
              Mostrar préstamos devueltos
            </label>
          </div>
          {item && <ItemCard item={item} />}
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          {isLoadingPrestamo ? (
            <p className="text-center text-2xl font-bold text-white">
              Cargando...
            </p>
          ) : (
            prestamos?.map((prestamo, id) => (
              <div className="bg-slate-400 p-5 text-neutral-800" key={id}>
                <ul>
                  <li>
                    Fecha de préstamo: {prestamo.createdAt.toDateString()}
                  </li>
                  <li>
                    Fecha de devolución: {prestamo.finalDate?.toDateString()}
                  </li>
                  <li> Cantidad: {prestamo.quantity} </li>
                  <li> Usuario: {prestamo.User.name} </li>
                  <li> Correo de usuario: {prestamo.User?.email} </li>
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewPrestamo;
