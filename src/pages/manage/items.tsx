"use client";

import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { useRouter } from "next/router";
import { UploadButton } from "rbgs/utils/uploadthing";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Items: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();
  const { status } = useSession();

  const { data: items, isLoading: isLoadingItems } = api.item.getAll.useQuery();
  const { mutateAsync: mutateAsyncItem } = api.item.create.useMutation();
  const { mutateAsync: mutateAsyncItemDelete } = api.item.delete.useMutation();

  const [imageUrl, setImageUrl] = useState<string>("");

  const handleCrearItem = async (data: {
    name: string;
    description: string;
    category: string;
    imgPath: string;
  }) => {
    await mutateAsyncItem(data);
    await utils.item.getAll.invalidate();
  };

  const handleDeleteItem = async (id: string) => {
    await mutateAsyncItemDelete(id);
    await utils.item.getAll.invalidate();
  };

  if (status === "unauthenticated") {
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-white">
          Inicia sesión para acceder a esta página.
        </h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="my-10 flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white">Items</h1>
        <Formik
          initialValues={{
            name: "",
            description: "",
            category: "",
            imgPath: "",
          }}
          onSubmit={(values, { setSubmitting }) => {
            void handleCrearItem({
              name: values.name,
              description: values.description,
              category: values.category,
              imgPath: imageUrl,
            });
            setSubmitting(false);
          }}
          validate={(values) => {
            const errors = z
              .object({
                name: z.string().min(1),
                description: z.string(),
                category: z.string().min(1),
                imgPath: z.string(),
              })
              .safeParse(values);

            return errors.success ? {} : { name: errors.error.message };
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mb-10 flex flex-row items-center justify-center gap-4">
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
                  as="select"
                  className="cursor-pointer appearance-none rounded-md bg-white/10 px-4 py-2 text-white"
                  name="category"
                  style={{
                    WebkitAppearance: "menulist",
                    MozAppearance: "menulist",
                  }}
                >
                  <option value="" disabled>
                    Seleccionar categoría
                  </option>
                  <option value="hardware" className="bg-gray-800">
                    Hardware
                  </option>
                  <option value="tools" className="bg-gray-800">
                    Tools
                  </option>
                  <option value="components" className="bg-gray-800">
                    Components
                  </option>
                </Field>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const uploadedUrl = res[0]?.ufsUrl ?? "";
                    console.log(
                      "Upload completed. URL from response:",
                      uploadedUrl
                    );
                    setImageUrl(uploadedUrl);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Imagen del item"
                    className="max-h-80"
                  />
                )}
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
