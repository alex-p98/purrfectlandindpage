import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onReset: () => void;
  onScan: () => void;
  isScanning?: boolean;
}

export const ImagePreview = ({ imageUrl, onReset, onScan, isScanning = false }: ImagePreviewProps) => {
  return (
    <div className="space-y-4 w-full max-w-xs">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <img 
          src={imageUrl} 
          alt="Captured ingredient list" 
          className="w-full h-full object-cover"
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 rounded-full"
          onClick={onReset}
          disabled={isScanning}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" 
        size="lg"
        onClick={onScan}
        disabled={isScanning}
      >
        {isScanning ? "Scanning..." : "Scan Ingredients"}
      </Button>
    </div>
  );
};