import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Scanner = () => {
  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Scan Ingredients</h2>
      <p className="text-sm text-muted-foreground text-center">
        Take a photo or upload an image of your cat food ingredients
      </p>
      <div className="flex gap-4 mt-4">
        <Button className="scale-animation" size="lg">
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
        <Button variant="outline" className="scale-animation" size="lg">
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
      </div>
    </Card>
  );
};