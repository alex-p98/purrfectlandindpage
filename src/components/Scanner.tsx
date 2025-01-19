import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);

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
            onClick={() => setShowCamera(true)}
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

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Photo</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Camera className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="rounded-full w-16 h-16 p-0"
              onClick={() => {
                // Here you would typically handle taking the photo
                console.log("Photo captured");
                setShowCamera(false);
              }}
            >
              <div className="rounded-full w-12 h-12 border-4 border-background" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};