import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CatProfileProps {
  name?: string;
}

export const CatProfile = ({ name }: CatProfileProps) => {
  const navigate = useNavigate();

  if (!name) {
    return (
      <Card
        className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation"
        onClick={() => navigate("/add-cat")}
      >
        <PlusCircle className="h-12 w-12 text-primary" />
        <p className="text-sm text-muted-foreground">Add a Cat</p>
      </Card>
    );
  }

  return (
    <Card
      className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation"
      onClick={() => navigate(`/cats/${name.toLowerCase()}`)}
    >
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-2xl font-semibold">{name[0]}</span>
      </div>
      <h3 className="font-medium">{name}</h3>
      <Button variant="secondary" size="sm" className="scale-animation">
        View Profile
      </Button>
    </Card>
  );
};