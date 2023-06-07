import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { useRouter } from "next/router";

const ManageCelda: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  const { id } = router.query;

  const { mutateAsync: mutateAsyncCeldaUpdate } =
    api.celda.update.useMutation();

  const {
    data: celda,
    isLoading: isLoadingCelda,
    error: errorCelda,
  } = api.celda.getOne.useQuery({
    id: id as string,
  });

  if (isLoadingCelda) {
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

  if (errorCelda || typeof id !== "string" || !celda) {
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
      </div>
    </Layout>
  );
};

export default ManageCelda;
