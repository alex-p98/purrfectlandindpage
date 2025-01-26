import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-0"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="flex justify-center">
        <img
          src="/lovable-uploads/3d045043-e078-46c6-9577-58cb24afec2a.png"
          alt="PurrfectDiet Logo"
          className="h-24"
        />
      </div>
    </div>
  );
};