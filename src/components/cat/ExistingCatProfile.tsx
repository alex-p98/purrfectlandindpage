import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useCatDelete } from "@/hooks/useCatDelete";

interface ExistingCatProfileProps {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export const ExistingCatProfile = ({ id, name, imageUrl }: ExistingCatProfileProps) => {
  const navigate = useNavigate();
  const { deleteCat } = useCatDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCat(id);
  };

  return (
    <Card
      className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation group relative"
      onClick={() => navigate(`/cats/${name.toLowerCase()}`)}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Avatar className="w-20 h-20">
        <AvatarImage 
          src={imageUrl || "/placeholder.svg"} 
          alt={name}
          className="object-cover"
        />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <h3 className="font-medium">{name}</h3>
      <Button variant="secondary" size="sm" className="scale-animation">
        View Profile
      </Button>
    </Card>
  );
};