import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CameraCapture } from "./scanner/CameraCapture";
import { ImagePreview } from "./scanner/ImagePreview";
import { PawRating } from "./scanner/PawRating";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthScore, setHealthScore] = useState<{ score: number; explanation: string } | null>(null);
  const [scansLeft, setScansLeft] = useState<number | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchUserScans();
    }
  }, [session]);

  const fetchUserScans = async () => {
    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select('scans_this_month')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setScansLeft(2 - (data.scans_this_month || 0));
      } else {
        // Create new user_usage record if it doesn't exist
        await supabase
          .from('user_usage')
          .insert([{ user_id: session?.user.id, scans_this_month: 0 }]);
        setScansLeft(2);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const updateScanCount = async () => {
    if (!session?.user) return;

    try {
      const { error } = await supabase
        .from('user_usage')
        .update({ 
          scans_this_month: (scansLeft !== null ? 2 - (scansLeft - 1) : 1),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      await fetchUserScans();
    } catch (error) {
      console.error('Error updating scan count:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (scansLeft !== null && scansLeft <= 0) {
      toast({
        title: "Scan limit reached",
        description: "You have used all your free scans for this month",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

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
      reader.readAsDataURL(file);
    }
  };

  const handleScanIngredients = async () => {
    if (!capturedImage) return;
    if (scansLeft !== null && scansLeft <= 0) {
      toast({
        title: "Scan limit reached",
        description: "You have used all your free scans for this month",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-ingredients', {
        body: { image: capturedImage },
      });

      if (analysisError) throw analysisError;

      if (!analysisData) {
        throw new Error('No analysis data received');
      }

      setHealthScore({
        score: analysisData.score,
        explanation: analysisData.explanation
      });
      
      await updateScanCount();
      
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
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Free scans remaining this month:
            </p>
            <Badge variant={scansLeft === 0 ? "destructive" : "default"}>
              {scansLeft ?? "..."}/2
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground text-center max-w-[280px]">
          Take a photo or upload an image of your cat food ingredients
        </p>
        
        {!capturedImage ? (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
            <Button 
              className="scale-animation w-full" 
              size="lg"
              onClick={() => {
                if (scansLeft !== null && scansLeft <= 0) {
                  toast({
                    title: "Scan limit reached",
                    description: "You have used all your free scans for this month",
                    variant: "destructive",
                  });
                  return;
                }
                setShowCamera(true);
              }}
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
              <div className="p-4 bg-muted rounded-lg space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-medium">Health Score:</span>
                  <PawRating score={healthScore.score} />
                </div>
                <p className="text-sm text-muted-foreground text-center">
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