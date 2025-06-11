import { Badge } from "src/components/ui/badge";

interface AvailabilityBadgeProps {
  count: number | undefined;
  isLoading?: boolean;
}

export const AvailabilityBadge = ({
  count,
  isLoading,
}: AvailabilityBadgeProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Disponibles:</span>
        <Badge variant="secondary" className="animate-pulse">
          Cargando...
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">Disponibles:</span>
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        {count !== undefined ? count.toString() : "cargando..."}
      </Badge>
    </div>
  );
};
