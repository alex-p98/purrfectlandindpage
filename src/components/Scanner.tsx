import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Scanner = () => {
  return (
    <Card className="p-8 flex flex-col items-center gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 wave-pattern" />
      
      <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
      <p className="text-sm text-muted-foreground text-center max-w-[280px]">
        Take a photo or upload an image of your cat food ingredients
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button className="scale-animation w-full" size="lg">
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
        <Button variant="secondary" className="scale-animation w-full" size="lg">
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
      </div>
    </Card>
  );
};