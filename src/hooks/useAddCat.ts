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
      // First check if user already has a cat
      const { data: existingCats, error: fetchError } = await supabase
        .from('cats')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (existingCats && existingCats.length > 0) {
        toast({
          title: "Limit Reached",
          description: "Free users can only create one cat profile. Please delete your existing profile to create a new one.",
          variant: "destructive",
        });
        return;
      }

      // If we get here, the user can create a new cat
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