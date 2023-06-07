import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
// import Link from "next/link";
import { useRouter } from "next/router";

const Manage: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  const { data: celdas, isLoading: isLoadingCeldas } =
    api.celda.getAll.useQuery();
  const { mutateAsync: mutateAsyncCelda } = api.celda.create.useMutation();
  const { mutateAsync: mutateAsyncCeldaDelete } =
    api.celda.delete.useMutation();

  const handleCrearCelda = async (data: {
    name: string;
    row: number;
    column: number;
  }) => {
    await mutateAsyncCelda(data);
    await utils.celda.getAll.invalidate();
  };

  const handleDeleteCelda = async (id: string) => {
    await mutateAsyncCeldaDelete(id);
    await utils.celda.getAll.invalidate();
  };

  // const handleUpdateCelda = async ({ id, name }: { id: string; name: string }) => {
  //   // const asd = await mutateAsyncCeldaUpdate({ id, name });
  //   // await utils.celda.getAll.invalidate();
  // };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">Celdas</h1>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values, { setSubmitting }) => {
            void handleCrearCelda({ name: values.name, row: 0, column: 0 });
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
                Crear Celda
              </button>
            </Form>
          )}
        </Formik>
        {isLoadingCeldas ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          celdas?.map((celda, id) => (
            <div key={id} className="flex flex-row justify-stretch gap-10">
              <p className="text-center text-2xl text-white">
                {celda.name}
              </p>
              <button
                className="rounded-full bg-yellow-400 px-5 py-3 font-bold text-white hover:bg-yellow-600"
                onClick={() => void router.push(`/manage/${celda.id}`)}
              >
                Actualizar Celda
              </button>

              <button
                className="rounded-full bg-red-400 px-5 py-3 font-bold text-white hover:bg-red-700"
                onClick={() => void handleDeleteCelda(celda.id)}
              >
                Borrar Celda
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Manage;
