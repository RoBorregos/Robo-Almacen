import { Prestamo, User } from "@prisma/client";
import { formatDate } from "rbgs/utils/date";

const PrestamoCard = ({
  prestamo,
  itemData,
}: {
  prestamo: Prestamo & { User: User };
  itemData: { imgPath: string; name: string };
}) => {
  return (
    <div className="flex flex-row bg-slate-400 text-neutral-800">
      <img
        className="aspect-square max-h-56 max-w-56"
        src={"/" + itemData.imgPath}
        alt={itemData.name}
      />

      <ul className="p-3">
        <li>
          {" "}
          <b>Usuario:</b> {prestamo.User.name}{" "}
        </li>
        <li>
          {" "}
          <b>Cantidad:</b> {prestamo.quantity}{" "}
        </li>
        <li>
          {" "}
          <b>Correo de usuario:</b> {prestamo.User?.email}{" "}
        </li>
        <li>
          <b>Regresado: </b> {prestamo.returned ? "Si" : "No"}
        </li>
        <li>
          {" "}
          <b>Fecha de préstamo:</b> {formatDate(prestamo.createdAt)}
        </li>
        <li>
          {" "}
          <b>Fecha de devolución:</b> {formatDate(prestamo.finalDate)}
        </li>
      </ul>
    </div>
  );
};

export default PrestamoCard;
