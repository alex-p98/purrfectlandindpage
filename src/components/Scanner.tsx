import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CameraCapture } from "./scanner/CameraCapture";
import { ImagePreview } from "./scanner/ImagePreview";
import { useToast } from "@/hooks/use-toast";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        toast({
          title: "Image uploaded",
          description: "Your image has been successfully uploaded",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read the image file",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanIngredients = async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    try {
      const response = await fetch('https://hook.us2.make.com/8yfg9zxxf24ttnq2qmvlfcy3uzjbt4db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: capturedImage,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan ingredients');
      }

      toast({
        title: "Scan complete",
        description: "Your ingredients have been successfully scanned",
      });
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Failed to scan ingredients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <Card className="p-8 flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 wave-pattern" />
        
        <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
        <p className="text-sm text-muted-foreground text-center max-w-[280px]">
          Take a photo or upload an image of your cat food ingredients
        </p>
        
        {!capturedImage ? (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <Button 
              className="scale-animation w-full" 
              size="lg"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Photo
            </Button>
            <Button 
              variant="secondary" 
              className="scale-animation w-full" 
              size="lg"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
        ) : (
          <ImagePreview 
            imageUrl={capturedImage}
            onReset={() => setCapturedImage(null)}
            onScan={handleScanIngredients}
            isScanning={isScanning}
          />
        )}
      </Card>

      <CameraCapture 
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={setCapturedImage}
      />
    </>
  );
};