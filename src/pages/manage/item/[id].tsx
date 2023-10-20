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

  const { data: item, isLoading: isLoadingItem } = api.item.getOne.useQuery({
    id: router.query.id as string ?? "",
  });
  const { mutateAsync: mutateAsyncItem } = api.item.update.useMutation();

  const handleUpdateItem = async (data: {
    name: string;
    description: string;
    category: string;
    department: string;
  }) => {
    console.log(router.query.id, data);
    await mutateAsyncItem({ id: router.query.id as string, ...data });
    await utils.item.getAll.invalidate();
    await router.push("/manage/items")
  };

  return isLoadingItem || !item ? (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">
          Cargando...
        </h1>
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">Actualizar {item.name}</h1>
        <Formik
          initialValues={{
            name: item.name,
            description: item.description,
            category: item.category,
            department: item.department,
          }}
          onSubmit={(values, { setSubmitting }) => {
            void handleUpdateItem({
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
                Actualizar Item
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default Items;
