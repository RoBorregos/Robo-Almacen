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
  const gridWidth = 100;
  const gridHeight = 8;
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
      <div className="row-auto mt-16 grid min-h-[90vh] w-full grid-flow-row overflow-x-auto">
        {/* Render the grid */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="col-auto grid grid-flow-col">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="group flex h-auto w-20 items-center justify-center border border-gray-300"
              >
                {cell.id !== "" ? (
                  <div>
                    <button
                      className="rounded-full bg-blue-400 px-2 py-1 font-bold text-white hover:bg-blue-700"
                      popovertarget={cell.id}
                      onClick={() => {
                        console.log("cell", cell);
                      }}
                      disabled={selectedCell.id !== ""}
                    >
                      {cell.name}
                    </button>
                    <div
                      popover="true"
                      id={cell.id}
                      className="relative rounded bg-slate-100"
                    >
                      <div className="flex flex-col gap-2">
                        <button
                          className="rounded-full bg-yellow-400 px-5 py-3 font-bold text-white hover:bg-yellow-600"
                          onClick={() => {
                            console.log("cell", cell);
                            void router.push(`/manage/${cell.id}`);
                          }}
                        >
                          {"Actualizar " + cell.name}
                        </button>
                        <button
                          className="rounded-full bg-red-400 px-5 py-3 font-bold text-white hover:bg-red-700"
                          onClick={() => void handleDeleteCelda(cell)}
                          popovertarget={cell.id}
                        >
                          Borrar Celda
                        </button>
                        <button
                          className="rounded-full bg-green-400 px-5 py-3 font-bold text-white hover:bg-green-700"
                          onClick={() => setSelectedCell(cell)}
                          popovertarget={cell.id}
                        >
                          Mover Celda
                        </button>
                      </div>
                    </div>
                  </div>
                ) : selectedCell.name === "" ? (
                  <button
                    className="invisible rounded-full bg-blue-400 px-3 py-1 font-bold text-white hover:bg-blue-700 group-hover:visible"
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
