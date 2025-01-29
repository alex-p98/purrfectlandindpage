import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { CameraCapture } from "./scanner/CameraCapture";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CatProfileProps {
  name?: string;
  imageUrl?: string | null;
  id?: string;
}

export const CatProfile = ({ name, imageUrl, id }: CatProfileProps) => {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
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

      // Force a refresh of the page to show the new image
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

      // Force a refresh of the page to show the new image
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
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />
      <Card
        className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation relative group"
        onClick={() => navigate(`/cats/${name.toLowerCase()}`)}
      >
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage 
              src={imageUrl || "/placeholder.svg"} 
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowCamera(true);
              }}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h3 className="font-medium">{name}</h3>
        <Button variant="secondary" size="sm" className="scale-animation">
          View Profile
        </Button>
      </Card>

      <CameraCapture
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
      />
    </>
  );
};