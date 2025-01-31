import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCatDelete = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteCat = async (id: string) => {
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

  return { deleteCat };
};