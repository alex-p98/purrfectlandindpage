import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface CatProfileProps {
  name?: string;
  imageUrl?: string | null;
  id?: string;
}

export const CatProfile = ({ name, imageUrl, id }: CatProfileProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('cats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cat profile deleted successfully",
      });

      // Invalidate and refetch cats query
      queryClient.invalidateQueries({ queryKey: ['cats'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cat profile",
        variant: "destructive",
      });
    }
  };

  const handleAddCat = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a cat profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cats')
        .insert({
          name: 'temp',
          breed: 'temp',
          age: 'temp',
          user_id: user.id
        });

      if (error?.message.includes('policy')) {
        toast({
          title: "Limit Reached",
          description: "Free users can only create one cat profile. Please delete your existing profile to create a new one.",
          variant: "destructive",
        });
        return;
      }

      // If we get here, the insert was successful (though it will be rolled back)
      // so we can navigate to the add cat page
      navigate("/add-cat");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check cat profile limit",
        variant: "destructive",
      });
    }
  };

  if (!name) {
    return (
      <Card
        className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation"
        onClick={handleAddCat}
      >
        <PlusCircle className="h-12 w-12 text-primary" />
        <p className="text-sm text-muted-foreground">Add a Cat</p>
      </Card>
    );
  }

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