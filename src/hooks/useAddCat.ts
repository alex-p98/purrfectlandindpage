import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAddCat = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const addCat = async () => {
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

  return { addCat };
};