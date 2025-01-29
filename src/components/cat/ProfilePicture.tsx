import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfilePictureActions } from "./ProfilePictureActions";

interface ProfilePictureProps {
  imageUrl?: string | null;
  name: string;
  onCameraClick: () => void;
  onUploadClick: () => void;
}

export const ProfilePicture = ({
  imageUrl,
  name,
  onCameraClick,
  onUploadClick,
}: ProfilePictureProps) => {
  return (
    <div className="relative">
      <Avatar className="w-20 h-20">
        <AvatarImage 
          src={imageUrl || "/placeholder.svg"} 
          alt={name}
          className="object-cover"
        />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <ProfilePictureActions
        onCameraClick={onCameraClick}
        onUploadClick={onUploadClick}
      />
    </div>
  );
};