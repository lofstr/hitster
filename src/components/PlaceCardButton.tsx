import { ChevronsDown } from "lucide-react";
import { Button } from "./ui/button";

export function PlaceCardButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={onClick}
    >
      <ChevronsDown />
    </Button>
  );
}
