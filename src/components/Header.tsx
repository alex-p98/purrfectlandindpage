import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm fixed top-0 z-50 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="scale-animation">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold gradient-score">
          PurrfectDiet
        </h1>
      </div>
    </header>
  );
};