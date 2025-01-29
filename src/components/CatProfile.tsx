import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CameraCapture } from "./scanner/CameraCapture";
import { ProfilePicture } from "./cat/ProfilePicture";
import { useProfilePicture } from "./cat/useProfilePicture";

interface CatProfileProps {
  name?: string;
  imageUrl?: string | null;
  id?: string;
}

export const CatProfile = ({ name, imageUrl, id }: CatProfileProps) => {
  const navigate = useNavigate();
  const {
    showCamera,
    setShowCamera,
    fileInputRef,
    handleFileUpload,
    handleCapture,
  } = useProfilePicture(id);

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
        <ProfilePicture
          imageUrl={imageUrl}
          name={name}
          onCameraClick={() => setShowCamera(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />
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