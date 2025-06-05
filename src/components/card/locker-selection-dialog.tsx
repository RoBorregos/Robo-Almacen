"use client";

import { useState } from "react";
import { Loader2, MapPin, Package, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
import type { CeldaItem } from "./item";

interface LockerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  celdasWithItem: CeldaItem[] | undefined;
  amount: number;
  itemName: string;
  onSelectLocker: (celdaItem: CeldaItem) => void;
  isLoading: boolean;
}

export const LockerSelectionDialog = ({
  open,
  onOpenChange,
  celdasWithItem,
  amount,
  itemName,
  onSelectLocker,
  isLoading,
}: LockerSelectionDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const availableCeldas =
    celdasWithItem?.filter((celdaItem) => celdaItem.quantity >= amount) ?? [];

  const filteredCeldas = availableCeldas.filter((celdaItem) =>
    celdaItem.Celda.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setSearchTerm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <MapPin className="h-5 w-5 text-blue-600" />
            Seleccionar Casillero
          </DialogTitle>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
            <DialogDescription className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-blue-600" />
              <span>
                Solicitando <strong>{amount}</strong> unidad
                {amount > 1 ? "es" : ""} de <strong>{itemName}</strong>
              </span>
            </DialogDescription>
          </div>

          {availableCeldas.length > 3 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Buscar casillero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </DialogHeader>

        <Separator />

        <div className="min-h-0 flex-1">
          {availableCeldas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No hay casilleros disponibles
              </h3>
              <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                No se encontraron casilleros con la cantidad solicitada (
                {amount} unidades).
              </p>
            </div>
          ) : filteredCeldas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                No se encontraron resultados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Intenta con un término de búsqueda diferente.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="grid gap-3">
                {filteredCeldas.map((celdaItem) => (
                  <div
                    key={celdaItem.id}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
                  >
                    <Button
                      onClick={() => onSelectLocker(celdaItem)}
                      disabled={isLoading}
                      variant="ghost"
                      className="h-auto w-full p-0 hover:bg-transparent"
                    >
                      <div className="flex w-full items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>

                          <div className="text-left">
                            <h4 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                              {celdaItem.Celda.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Casillero disponible
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              {celdaItem.quantity} disponibles
                            </Badge>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Necesitas {amount}
                            </p>
                          </div>

                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {availableCeldas.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {filteredCeldas.length} de {availableCeldas.length} casilleros
                disponibles
              </span>
              <span>Selecciona un casillero para continuar</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
