import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";

const Manage: NextPage = () => {
  const utils = api.useContext();

  const { data: celdas, isLoading: isLoadingCeldas } =
    api.celda.getAll.useQuery();
  const { mutateAsync: mutateAsyncCelda } = api.celda.create.useMutation();
  const { mutateAsync: mutateAsyncCeldaDelete } =
    api.celda.delete.useMutation();

  const handleCrearCelda = async (name: string) => {
    const asd = await mutateAsyncCelda(name);
    await utils.celda.getAll.invalidate();
  };

  const handleDeleteCelda = async (id: string) => {
    const asd = await mutateAsyncCeldaDelete(id);
    await utils.celda.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">Celdas</h1>
        {/* {isLoadingCeldas ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          celdas?.map((celda, id) => (
            <p className="text-center text-2xl text-white" key={id}>
              {celda.name}
            </p>
          ))
        )} */}
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values, { setSubmitting }) => {
            handleCrearCelda(values.name);
            setSubmitting(false);
          }}
          validate={(values) => {
            const errors = z.string().nonempty().safeParse(values.name);
            return errors.success ? {} : { name: errors.error.message };
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="flex flex-row items-center justify-center gap-4">
              <Field
                className="rounded-md bg-white/10 px-4 py-2 text-white"
                type="text"
                name="name"
              />

              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
                type="submit"
              >
                Crear ejemplo
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
            <div className="flex flex-row justify-stretch gap-10">
              <p className="text-center text-2xl text-white" key={id}>
                {celda.name}
              </p>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
                onClick={() => void handleDeleteCelda(celda.id)}
              >
                Borrar
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Manage;
