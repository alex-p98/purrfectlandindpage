import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
    startCamera();
  };

  const handleCloseCamera = () => {
    stopCamera();
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    }
    handleCloseCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanIngredients = () => {
    console.log("Scanning ingredients from image:", capturedImage);
  };

  const resetCapture = () => {
    setCapturedImage(null);
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
              onClick={handleOpenCamera}
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
          <div className="space-y-4 w-full max-w-xs">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img 
                src={capturedImage} 
                alt="Captured ingredient list" 
                className="w-full h-full object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={resetCapture}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" 
              size="lg"
              onClick={handleScanIngredients}
            >
              Scan Ingredients
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={showCamera} onOpenChange={handleCloseCamera}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Take a Photo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 p-0"
              onClick={capturePhoto}
            >
              <div className="rounded-full w-12 h-12 border-4 border-background" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};