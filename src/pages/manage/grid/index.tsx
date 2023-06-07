import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
// import React from "react";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";

const Grid: NextPage = () => {
  const utils = api.useContext();

  // Generate grid data
  const gridWidth = 100;
  const gridHeight = 10;
  const gridData = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => " ")
  );

  const [grid, setGrid] = useState(gridData);
  const [hideDialog, setHideDialog] = useState(false);

  const {
    data: celdas,
    isLoading: isLoadingCeldas,
    isError: isErrorCeldas,
  } = api.celda.getAll.useQuery();

  const { mutateAsync: mutateAsyncCelda } = api.celda.create.useMutation();
  const { mutateAsync: mutateAsyncCeldaUpdate } =
    api.celda.update.useMutation();

  useEffect(() => {
    // Fill the grid with the celdas
    if (celdas === undefined) return;

    celdas.forEach((celda) => {
      // if (celda === undefined) return;

      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];

        const gridRow = newGrid[celda.row] ? newGrid[celda.row] : undefined;
        if (gridRow === undefined) return prevGrid;

        const gridCelda = gridRow[celda.column]
          ? gridRow[celda.column]
          : undefined;
        if (gridCelda === undefined) return prevGrid;

        gridRow[celda.column] = celda.name;
        return newGrid;
      });
    });
  }, [celdas]);

  if (isLoadingCeldas)
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );

  if (isErrorCeldas || !celdas)
    return (
      <Layout>
        <div>Error</div>
      </Layout>
    );

  // Fill the grid with the celdas
  // celdas.forEach((celda) => {
  //   if (celda === undefined) return;

  //   // gridRow[celda.column] = celda.name;
  //   setGrid((prevGrid) => {
  //     const newGrid = [...prevGrid];

  //     const gridRow = newGrid[celda.row] ? newGrid[celda.row] : undefined;
  //     if (gridRow === undefined) return prevGrid;

  //     const gridCelda = gridRow[celda.column] ? gridRow[celda.column] : undefined;
  //     if (gridCelda === undefined) return prevGrid;

  //     gridRow[celda.column] = celda.name;
  //     return newGrid;
  //   });
  // });

  const handleCreateCelda = async (row: number, column: number) => {
    const name = prompt("Nombre de la celda");
    if (name === null) return;
    await mutateAsyncCelda({
      name: name,
      row: row,
      column: column,
    });
    await utils.celda.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="row-auto grid min-h-[80vh] w-full grid-flow-row overflow-x-auto align-top">
        {/* Render the grid */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="col-auto grid grid-flow-col">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="group flex h-auto w-12 items-center justify-center border border-gray-300"
              >
                {cell !== " " ? (
                  cell
                ) : (
                  <button className="invisible rounded-full bg-blue-400 px-3 py-1 font-bold text-white hover:bg-blue-700 group-hover:visible" onClick={() => {
                    void handleCreateCelda(rowIndex, cellIndex);
                  }}>
                    +
                  </button>
                )}
                {/* <dialog open hidden={hideDialog} className="rounded-md bg-white/10 px-4 py-2 text-white" >
                  <Formik
                    initialValues={{
                      name: "",
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      await mutateAsyncCelda({
                        name: values.name,
                        row: rowIndex,
                        column: cellIndex,
                      });
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          className="rounded-md bg-white/10 px-4 py-2 text-white"
                          type="text"
                          name="name"
                          placeholder="Nombre"
                        />
                        <button
                          className="rounded-md bg-white/10 px-4 py-2 text-white"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
                      </Form>
                    )}
                  </Formik>
                </dialog> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Grid;
