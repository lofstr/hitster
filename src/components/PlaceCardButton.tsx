import { ChevronsDown } from "lucide-react";
import { Button } from "./ui/button";

export function PlaceCardButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="cursor-pointer transition-transform duration-200 hover:scale-125"
      onClick={onClick}
    >
      <ChevronsDown />
    </Button>
  );
}
