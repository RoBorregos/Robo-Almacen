import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// const SearchBar = ({ options, o}) => {

const ManageCelda: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  const { id } = router.query;

  const { mutateAsync: mutateAsyncCeldaUpdate } =
    api.celda.update.useMutation();

  const { mutateAsync: mutateAsyncAddItemToCelda } =
    api.celda.addItem.useMutation();

  const { mutateAsync: mutateAsyncRemoveItemFromCelda } =
    api.celda.removeItem.useMutation();

  const { mutateAsync: mutateAsyncUpdateItemFromCelda } =
    api.celda.updateItemQuantity.useMutation();

  const {
    data: celda,
    isLoading: isLoadingCelda,
    error: errorCelda,
  } = api.celda.getOne.useQuery({
    id: id as string,
  });

  const {
    data: items,
    isLoading: isLoadingItems,
    error: errorItems,
  } = api.item.getAll.useQuery();

  const [celdaItemsData, setCeldaItemsData] = useState<
    {
      itemId: string;
      name: string;
      quantity: number;
    }[]
  >([]);

  useEffect(() => {
    if (isLoadingCelda || isLoadingItems || errorCelda || errorItems) return;

    const celdaItems = celda?.CeldaItem?.map((celdaItem) => ({
      itemId: celdaItem.itemId,
      name: items.find((item) => item.id === celdaItem.itemId)?.name ?? "",
      quantity: celdaItem.quantity,
    }));

    console.log(celdaItems);
    console.log(items);

    setCeldaItemsData(celdaItems ?? []);
  }, [isLoadingCelda, isLoadingItems, errorCelda, errorItems, celda, items]);

  if (isLoadingCelda || isLoadingItems) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-4xl font-bold text-white">
            Cargando...
          </h1>
        </div>
      </Layout>
    );
  }

  if (errorCelda || typeof id !== "string" || !celda || errorItems) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-4xl font-bold text-white">
            Celda no encontrada
          </h1>
        </div>
      </Layout>
    );
  }

  const handleUpdateCelda = async ({
    id,
    name,
    row,
    column,
  }: {
    id: string;
    name: string;
    row: number;
    column: number;
  }) => {
    await mutateAsyncCeldaUpdate({
      id: id,
      name: name,
      row: row,
      column: column,
    });
    await utils.celda.getAll.invalidate();
    name = "";

    void router
      .push("/manage")
      .catch((err) => console.error(err))
      .then(() => console.log("Celda actualizada"));
  };

  const handleAddItemToCelda = async ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    await mutateAsyncAddItemToCelda({
      id: id,
      itemId: itemId,
      quantity: quantity,
    });
    await utils.celda.getAll.invalidate();
    await utils.celda.getOne.invalidate({ id: id });
    itemId = "";
    quantity = 0;
  };

  const handleRemoveItemFromCelda = async ({ itemId }: { itemId: string }) => {
    console.log("itemId", itemId, "id", id);
    await mutateAsyncRemoveItemFromCelda({
      id: id,
      itemId: itemId,
    });
    await utils.celda.getAll.invalidate();
    await utils.celda.getOne.invalidate({ id: id });
    itemId = "";
  };

  const handleUpdateItemFromCelda = async ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    await mutateAsyncUpdateItemFromCelda({
      id: id,
      itemId: itemId,
      quantity: quantity,
    });
    await utils.celda.getAll.invalidate();
    await utils.celda.getOne.invalidate({ id: id });
    itemId = "";
    quantity = 0;
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">
          {isLoadingCelda ? "Cargando..." : `Celda ${celda.name}`}
        </h1>
        <Formik
          initialValues={{
            name: celda.name,
            row: celda.row,
            column: celda.column,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await handleUpdateCelda({
              id,
              name: values.name,
              row: values.row,
              column: values.column,
            });
            setSubmitting(false);
          }}
          validate={(values) => {
            const errors = z.string().nonempty().safeParse(values.name);
            return errors.success ? {} : { name: errors.error.message };
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-row items-center justify-center gap-4">
              <Field
                className="rounded-md bg-white/10 px-4 py-2 text-white"
                type="text"
                name="name"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-400 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                Actualizar
              </button>
            </Form>
          )}
        </Formik>

        <div className="gap-50 flex flex-row justify-evenly">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-4xl font-bold text-white">
              Inventario
            </h1>
            <div className="m-5 rounded-lg bg-slate-600">
              <div className="m-4 flex flex-col items-center justify-center gap-4 overflow-y-scroll">
                <table className="border-separate border-spacing-x-4 border-spacing-y-2">
                  <thead>
                    <tr className="m-2">
                      <th className="text-center text-2xl font-bold text-white">
                        Nombre
                      </th>
                      <th className="text-center text-2xl font-bold text-white">
                        Cantidad
                      </th>
                      <th className="text-center text-2xl font-bold text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {celdaItemsData.map((celdaItem, index) => (
                      <tr
                        // className="flex flex-row items-center justify-center gap-4 px-3"
                        key={index}
                      >
                        <th className="text-center text-xl text-white">
                          {celdaItem.name}
                        </th>
                        <th className="text-center text-xl text-white">
                          {celdaItem.quantity}
                        </th>
                        <th>
                          <button
                            className="rounded-full bg-red-400 px-3 py-2 font-bold text-white hover:bg-red-700"
                            onClick={() =>
                              void handleRemoveItemFromCelda({
                                itemId: celdaItem.itemId,
                              })
                            }
                          >
                            Eliminar
                          </button>
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-center text-4xl font-bold text-white">Items</h1>
            <div className="m-5 rounded-lg bg-slate-600">
              {/* <div className="m-4 flex flex-col items-center justify-center gap-4 overflow-y-scroll"> */}
              <div className="m-4 grid overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                  <h1 className="my-2 text-center text-2xl font-bold text-white">
                    Nombre
                  </h1>
                  <h1 className="my-2 text-center text-2xl font-bold text-white">
                    Cantidad
                  </h1>
                  <h1 className="text-center text-2xl font-bold text-white"></h1>
                </div>
                {items?.map((item, index) => (
                  <div
                    className="my-2 grid grid-cols-3 gap-4 justify-items-center"
                    // className="flex flex-row items-center justify-center gap-4 px-3"
                    key={index}
                  >
                    <h1 className="text-center text-xl font-bold text-white">
                      {item.name}
                    </h1>
                    <Formik
                      initialValues={{
                        quantity: 0,
                      }}
                      onSubmit={async (values, { setSubmitting }) => {
                        if (
                          celdaItemsData.some((celdaItem) => {
                            if (celdaItem.itemId === item.id) {
                              return true;
                            }
                          })
                        ) {
                          await handleUpdateItemFromCelda({
                            itemId: item.id,
                            quantity: values.quantity,
                          });
                          setSubmitting(false);
                        } else {
                          await handleAddItemToCelda({
                            itemId: item.id,
                            quantity: values.quantity,
                          });
                          setSubmitting(false);
                        }
                      }}
                      validate={(values) => {
                        const errors = z
                          .number()
                          .min(1)
                          .safeParse(values.quantity);
                        return errors.success
                          ? {}
                          : { quantity: errors.error.message };
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form className="col-span-2 grid grid-cols-2 gap-4">
                          {/* <Form className="flex flex-row justify-evenly gap-4"> */}
                          <Field
                            className="w-20 rounded-md bg-white/10 px-4 py-2 text-white"
                            type="number"
                            name="quantity"
                          />
                          <button
                            className="rounded-full bg-blue-400 px-3 py-2 font-bold text-white hover:bg-blue-700"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {celdaItemsData.some((celdaItem) => {
                              if (celdaItem.itemId === item.id) {
                                return true;
                              }
                            })
                              ? "Actualizar"
                              : "Agregar"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageCelda;
