import { type NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
// import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Grid: NextPage = () => {
  const utils = api.useContext();
  const router = useRouter();

  // Generate grid data
  const gridWidth = 1;
  const gridHeight = 4;
  const gridData = Array.from({ length: gridHeight }, () =>
    Array.from({ length: gridWidth }, () => ({
      name: "",
      id: "",
      row: 0,
      column: 0,
    }))
  );

  const [selectedCell, setSelectedCell] = useState<{
    name: string;
    id: string;
    row: number;
    column: number;
  }>({ name: "", id: "", row: 0, column: 0 });

  const [selectedModal, setSelectedModal] = useState<{
    row: number;
    column: number;
  }>({ row: -1, column: -1 });

  const [grid, setGrid] = useState(gridData);

  const {
    data: celdas,
    isLoading: isLoadingCeldas,
    isError: isErrorCeldas,
  } = api.celda.getAll.useQuery();

  const { mutateAsync: mutateAsyncCelda } = api.celda.create.useMutation();
  const { mutateAsync: mutateAsyncCeldaDelete } =
    api.celda.delete.useMutation();
  const { mutateAsync: mutateAsyncCeldaUpdate } =
    api.celda.update.useMutation();

  useEffect(() => {
    console.log("celdas", celdas);
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

        gridRow[celda.column] = {
          name: celda.name,
          id: celda.id,
          row: celda.row,
          column: celda.column,
        };
        // gridRow[celda.column] = celda;
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

  const handleDeleteCelda = async (cell: {
    row: number;
    column: number;
    id: string;
  }) => {
    // delete celda from array
    console.log("cell", cell);
    const newGrid = [...grid];

    const newRow = newGrid[cell.row] ? newGrid[cell.row] : undefined;
    if (newRow === undefined) return;

    newRow[cell.column] = { name: "", id: "", row: 0, column: 0 };

    setGrid(newGrid);

    await mutateAsyncCeldaDelete(cell.id);
    await utils.celda.getAll.invalidate();
  };

  const handleUpdateCelda = async (
    name: string,
    row: number,
    column: number,
    id: string,

    prevRow: number,
    prevColumn: number
  ) => {
    const newGrid = [...grid];

    const newRow = newGrid[prevRow] ? newGrid[prevRow] : undefined;
    if (newRow === undefined) return;

    newRow[prevColumn] = { name: "", id: "", row: 0, column: 0 };

    setGrid(newGrid);

    setSelectedCell({ name: "", id: "", row: 0, column: 0 });

    await mutateAsyncCeldaUpdate({
      id: id,
      name: name,
      row: row,
      column: column,
    });
    await utils.celda.getAll.invalidate();
  };

  return (
    <Layout>
      <div className="-z-0 row-auto grid w-full grid-flow-row overflow-x-auto overflow-y-clip justify-items-center">
        {/* Render the grid */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="col-auto grid grid-flow-col">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="group flex h-fit p-10 w-40 items-center justify-center border border-gray-300"
              >
                {cell.id !== "" ? (
                  <div>
                    <button
                      className="rounded-3xl bg-blue-400 px-2 py-1 font-bold text-white hover:bg-blue-700 transition ease-in-out delay-10 hover:scale-125 duration-300"
                      // popovertarget={cell.id}
                      onClick={() => {
                        console.log("cell", cell);
                        // document.getElementById(cell.id)?.showModal();
                        const dialog = document.getElementById(
                          cell.id
                        ) as HTMLDialogElement;
                        if (dialog) {
                          selectedModal.column === cellIndex && selectedModal.row === rowIndex ? setSelectedModal({ row: -1, column: -1 }) : setSelectedModal({ row: rowIndex, column: cellIndex });
                          dialog.open ? dialog.close() : dialog.show();
                          console.log("selectedModal", selectedModal);
                        }
                      }}
                      disabled={selectedCell.id !== ""}
                    >
                      {cell.name}
                    </button>

                    <div className="relative">
                    {/* <div className={"relative" + (selectedModal.column === cellIndex && selectedModal.row === rowIndex ? " visible transition ease-in-out delay-150 bg-blue-500 -translate-y-1 scale-110 duration-300" : " ")} > */}
                      <dialog
                        className={
                          "absolute right-9 rounded-lg bg-white p-5 shadow-lg shadow-cyan-500/50 " +
                          (rowIndex > gridHeight / 2 - 1
                            ? " bottom-16"
                            : " top-5") +
                          (cellIndex > gridWidth / 2 ? " right-12" : " left-12") +
                          (selectedModal.column === cellIndex && selectedModal.row === rowIndex ? " visible transition ease-in-out delay-0 bg-blue-500 -translate-y-1 scale-110 duration-200" : " ")
                        }
                        id={cell.id}
                      >
                        <div className="flex flex-col gap-2 text-sm">
                          <button
                            className="rounded-2xl bg-yellow-400 px-3 py-2 font-bold text-white hover:bg-yellow-600"
                            onClick={() => {
                              console.log("cell", cell);
                              void router.push(`/manage/${cell.id}`);
                            }}
                          >
                            {"Actualizar " + cell.name}
                          </button>
                          <button
                            className="rounded-2xl bg-red-400 px-3 py-2 font-bold text-white hover:bg-red-700"
                            onClick={() => {
                              void handleDeleteCelda(cell);
                              const dialog = document.getElementById(
                                cell.id
                              ) as HTMLDialogElement;
                              if (dialog) {
                                dialog.close();
                              }
                            }}
                          >
                            Borrar Celda
                          </button>
                          <button
                            className="rounded-2xl bg-blue-400 px-3 py-2 font-bold text-white hover:bg-blue-700"
                            onClick={() => {
                              setSelectedCell(cell);
                              const dialog = document.getElementById(
                                cell.id
                              ) as HTMLDialogElement;
                              if (dialog) {
                                dialog.close();
                              }
                            }}
                          >
                            Mover Celda
                          </button>

                          <button
                            className="rounded-2xl bg-green-400 px-3 py-2 font-bold text-white hover:bg-green-700"
                            onClick={() => {
                              const dialog = document.getElementById(
                                cell.id
                              ) as HTMLDialogElement;
                              if (dialog) {
                                dialog.close();
                              }
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </dialog>
                    </div>
                  </div>
                ) : selectedCell.name === "" ? (
                  <button
                    className="invisible rounded-full bg-blue-400 px-3 py-1 font-bold text-white hover:bg-blue-700 group-hover:visible group-hover:transition group-hover:ease-in-out group-hover:delay-10 group-hover:scale-125 group-hover:duration-150"
                    onClick={() => {
                      void handleCreateCelda(rowIndex, cellIndex);
                    }}
                  >
                    +
                  </button>
                ) : (
                  <button
                    className="rounded-full bg-green-400 px-3 py-1 font-bold text-white hover:bg-green-700"
                    onClick={() => {
                      void handleUpdateCelda(
                        selectedCell.name,
                        rowIndex,
                        cellIndex,
                        selectedCell.id,
                        selectedCell.row,
                        selectedCell.column
                      );
                    }}
                  >
                    *
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Grid;
