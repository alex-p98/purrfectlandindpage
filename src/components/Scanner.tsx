import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CameraCapture } from "./scanner/CameraCapture";
import { ImagePreview } from "./scanner/ImagePreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthScore, setHealthScore] = useState<{ score: number; explanation: string } | null>(null);
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
        setHealthScore(null);
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
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-ingredients', {
        body: { image: capturedImage },
      });

      if (analysisError) {
        throw new Error('Failed to analyze ingredients');
      }

      // Convert the score from 10 to 5
      const convertedScore = Math.round((analysisData.score / 10) * 5);
      setHealthScore({
        score: convertedScore,
        explanation: analysisData.explanation
      });
      
      toast({
        title: "Analysis complete",
        description: "Your ingredients have been successfully analyzed",
      });
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "Scan failed",
        description: "Failed to analyze ingredients. Please try again.",
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
          <div className="space-y-6 w-full max-w-xs">
            <ImagePreview 
              imageUrl={capturedImage}
              onReset={() => {
                setCapturedImage(null);
                setHealthScore(null);
              }}
              onScan={handleScanIngredients}
              isScanning={isScanning}
            />
            
            {healthScore && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Health Score:</span>
                  <span className={`text-lg font-bold ${
                    healthScore.score >= 4 ? 'text-green-500' :
                    healthScore.score >= 2 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {healthScore.score}/5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {healthScore.explanation}
                </p>
              </div>
            )}
          </div>
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