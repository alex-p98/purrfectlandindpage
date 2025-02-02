import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaptureOptionsProps {
  onCameraClick: () => void;
  scansLeft: number;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CaptureOptions = ({ onCameraClick, scansLeft, onFileUpload }: CaptureOptionsProps) => {
  return (
    <>
      <p className="text-sm text-muted-foreground text-center max-w-[280px]">
        Take a photo or upload an image of your cat food ingredients
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button 
          className="scale-animation w-full" 
          size="lg"
          onClick={onCameraClick}
          disabled={scansLeft === 0}
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
        <Button 
          variant="secondary" 
          className="scale-animation w-full" 
          size="lg"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={scansLeft === 0}
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileUpload}
          />
        </Button>
      </div>
    </>
  );
};