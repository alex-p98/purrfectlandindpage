import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export const CameraCapture = ({ open, onClose, onCapture }: CameraCaptureProps) => {
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

  const handleClose = () => {
    stopCamera();
    onClose();
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
        onCapture(imageData);
      }
    }
    handleClose();
  };

  // Start camera when dialog opens
  if (open && !stream) {
    startCamera();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
  );
};