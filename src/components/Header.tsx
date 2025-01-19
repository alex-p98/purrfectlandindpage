import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm fixed top-0 z-50">
      <Button variant="ghost" size="icon" className="scale-animation">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img 
          src="/lovable-uploads/3d045043-e078-46c6-9577-58cb24afec2a.png" 
          alt="PurrfectDiet Logo" 
          className="h-24 w-auto" 
        />
      </div>
      <div className="w-10" /> {/* Spacer to balance the menu button */}
    </header>
  );
};