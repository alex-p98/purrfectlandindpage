import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureActionsProps {
  onCameraClick: () => void;
  onUploadClick: () => void;
}

export const ProfilePictureActions = ({
  onCameraClick,
  onUploadClick,
}: ProfilePictureActionsProps) => {
  return (
    <div className="absolute -bottom-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onCameraClick();
        }}
      >
        <Camera className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onUploadClick();
        }}
      >
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
};