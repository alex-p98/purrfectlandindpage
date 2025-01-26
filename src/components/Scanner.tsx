import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
        // You can handle the captured image data here
        // For example, convert to base64:
        const imageData = canvas.toDataURL('image/jpeg');
        console.log('Captured image:', imageData);
      }
    }
    handleCloseCamera();
  };

  return (
    <>
      <Card className="p-8 flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 wave-pattern" />
        
        <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
        <p className="text-sm text-muted-foreground text-center max-w-[280px]">
          Take a photo or upload an image of your cat food ingredients
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button 
            className="scale-animation w-full" 
            size="lg"
            onClick={handleOpenCamera}
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
          <Button variant="secondary" className="scale-animation w-full" size="lg">
            <Upload className="mr-2 h-5 w-5" />
            Upload
          </Button>
        </div>
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