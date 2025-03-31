import { HorizontalGeneralCard } from "./HorizontalGeneralCard";
import { api } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";

// Prestamo card must contain:
// Button to return items
// Count of the amount of items
// Date of order
// Date of return (if returned)

export const PrestamoCard = ({
  id,
  showUser = true,
}: {
  id: string;
  showUser: boolean;
}) => {
  const context = api.useContext();
  const { data: prestamo, isLoading } =
    api.prestamos.getPrestamoDetailsById.useQuery({
      id: id,
    });

  const returnPrestamo = api.prestamos.returnPrestamo.useMutation({
    onSuccess: (message) => {
      toast.success(message, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      void context.prestamos.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const issuePrestamo = api.prestamos.issuePrestamo.useMutation({
    onSuccess: (message) => {
      toast.success(message, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      void context.prestamos.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  if (isLoading) {
    return (
      <HorizontalGeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          Cargando...
        </h6>
      </HorizontalGeneralCard>
    );
  } else if (prestamo) {
    return (
      <>
        <HorizontalGeneralCard
          title={prestamo.Item.name}
          imageLink={prestamo.Item.imgPath}
          className="my-2"
        >
          <div className="flex flex-col">
            <div className="align-middl mb-6 mt-2 flex h-20 w-full flex-col justify-around text-black">
              <p>
                Descripción:{" "}
                {prestamo.description === ""
                  ? "No hay descripción"
                  : prestamo.description}
              </p>
              <p>Fecha de préstamo: {prestamo.initialDate.toDateString()}</p>
              <p>Cantidad: {prestamo.quantity}</p>
              {showUser && <p>Usuario: {prestamo.User.name}</p>}
              {prestamo.returned && prestamo.finalDate && (
                <p>Fecha de regreso: {prestamo.finalDate?.toDateString()}</p>
              )}
            </div>
            {/* BUTTONS JUST FOR TESTING */}
            {!prestamo.returned && prestamo.issued && (
              <button
                onClick={() => returnPrestamo.mutate({ id: id })}
                className="ml-auto mr-auto w-fit rounded-lg bg-blue-400 p-2 text-black"
              >
                Devolver préstamo
              </button>
            )}
            {!prestamo.issued && (
              <button
                onClick={() => issuePrestamo.mutate({ id: id })}
                className="ml-auto mr-auto w-fit rounded-lg bg-blue-400 p-2 text-black"
              >
                Issue prestamo
              </button>
            )}
          </div>
        </HorizontalGeneralCard>
      </>
    );
  } else {
    return (
      <HorizontalGeneralCard>
        <h6 className="text-center text-4xl font-bold text-white">
          No se encontró el préstamo
        </h6>
      </HorizontalGeneralCard>
    );
  }
};
