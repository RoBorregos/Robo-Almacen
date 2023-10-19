import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
// import Link from "next/link";
import { useRouter } from "next/router";

const Items: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  const { data: items, isLoading: isLoadingItems } = api.item.getAll.useQuery();
  const { mutateAsync: mutateAsyncItem } = api.item.create.useMutation();
  const { mutateAsync: mutateAsyncItemDelete } = api.item.delete.useMutation();

  const handleCrearItem = async (data: {
    name: string;
    description: string;
    category: string;
    department: string;
  }) => {
    await mutateAsyncItem(data);
    await utils.item.getAll.invalidate();
  };

  const handleDeleteItem = async (id: string) => {
    await mutateAsyncItemDelete(id);
    await utils.item.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">Items</h1>
        <Formik
          initialValues={{
            name: "",
            description: "",
            category: "",
            department: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            void handleCrearItem({
              name: values.name,
              description: values.description,
              category: values.category,
              department: values.department,
            });
            setSubmitting(false);
          }}
          validate={(values) => {
            // const errors = z.string().nonempty().safeParse(values.name);
            const errors = z
              .object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
                category: z.string().nonempty(),
                department: z.string().nonempty(),
              })
              .safeParse(values);

            return errors.success ? {} : { name: errors.error.message };
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-row items-center justify-center gap-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Field
                  className="rounded-md bg-white/10 px-4 py-2 text-white"
                  type="text"
                  name="name"
                  placeholder="Nombre"
                />
                <Field
                  className="rounded-md bg-white/10 px-4 py-2 text-white"
                  type="text"
                  name="description"
                  placeholder="Descripción"
                />
                <Field
                  className="rounded-md bg-white/10 px-4 py-2 text-white"
                  type="text"
                  name="category"
                  placeholder="Categoría"
                />
                <Field
                  className="rounded-md bg-white/10 px-4 py-2 text-white"
                  type="text"
                  name="department"
                  placeholder="Departamento"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-400 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                Crear Item
              </button>
            </Form>
          )}
        </Formik>
        {isLoadingItems ? (
          <p className="text-center text-2xl font-bold text-white">
            Cargando...
          </p>
        ) : (
          items?.map((item, index) => (
            <div key={index} className="flex flex-row justify-stretch gap-10">
              <p className="text-center text-2xl text-white">{item.name}</p>
              <button
                className="rounded-full bg-yellow-400 px-5 py-3 font-bold text-white hover:bg-yellow-600"
                onClick={() => void router.push(`/manage/item/${item.id}`)}
              >
                Actualizar Item
              </button>

              <button
                className="rounded-full bg-red-400 px-5 py-3 font-bold text-white hover:bg-red-700"
                onClick={() => void handleDeleteItem(item.id)}
              >
                Borrar Item
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Items;
