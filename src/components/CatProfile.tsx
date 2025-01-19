import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CatProfileProps {
  name?: string;
  onClick: () => void;
}

export const CatProfile = ({ name, onClick }: CatProfileProps) => {
  if (!name) {
    return (
      <Card className="p-4 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation" onClick={onClick}>
        <PlusCircle className="h-10 w-10 text-primary" />
        <p className="text-sm text-muted-foreground">Add a Cat</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation" onClick={onClick}>
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
        <span className="text-2xl">{name[0]}</span>
      </div>
      <h3 className="font-medium">{name}</h3>
      <Button variant="secondary" size="sm">View Profile</Button>
    </Card>
  );
};