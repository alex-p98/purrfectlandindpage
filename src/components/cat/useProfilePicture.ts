import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfilePicture = (id?: string) => {
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cat-pictures')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cat-pictures')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('cats')
        .update({ image_url: publicUrl })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  const handleCapture = async (newImageUrl: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('cats')
        .update({ image_url: newImageUrl })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating cat profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    }
  };

  return {
    showCamera,
    setShowCamera,
    fileInputRef,
    handleFileUpload,
    handleCapture,
  };
};