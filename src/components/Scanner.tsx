import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CameraCapture } from "./scanner/CameraCapture";
import { ImagePreview } from "./scanner/ImagePreview";
import { PawRating } from "./scanner/PawRating";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const Scanner = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthScore, setHealthScore] = useState<{ score: number; explanation: string } | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  // Query to get user's scan usage
  const { data: usage, refetch: refetchUsage } = useQuery({
    queryKey: ['user-usage'],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      // First try to get existing record
      const { data: existingData, error: fetchError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      // If no record exists, create one
      if (!existingData) {
        const { data: newData, error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: session.user.id,
            scans_this_month: 0,
            last_scan_reset: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData;
      }
      
      return existingData;
    },
    enabled: !!session?.user.id
  });

  // Query to get user's subscription tier
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data.tier;
    },
    enabled: !!session?.user.id
  });

  const getScansLimit = () => {
    switch (subscription) {
      case 'basic':
        return 2;
      case 'pro':
        return 10;
      case 'unlimited':
        return Infinity;
      default:
        return 2; // Free tier
    }
  };

  const getRemainingScans = () => {
    const limit = getScansLimit();
    const used = usage?.scans_this_month || 0;
    return limit === Infinity ? '∞' : Math.max(0, limit - used);
  };

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
    if (!capturedImage || !session) return;

    const scansLimit = getScansLimit();
    const scansUsed = usage?.scans_this_month || 0;

    if (scansUsed >= scansLimit && scansLimit !== Infinity) {
      toast({
        title: "Scan limit reached",
        description: "Please upgrade your subscription to continue scanning ingredients.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      console.log('Sending image data, length:', capturedImage.length);
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-ingredients', {
        body: { image: capturedImage },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (analysisError) throw analysisError;

      if (!analysisData) {
        throw new Error('No analysis data received');
      }

      // Update scan count
      const { error: updateError } = await supabase
        .from('user_usage')
        .upsert({
          user_id: session.user.id,
          scans_this_month: (usage?.scans_this_month || 0) + 1,
          last_scan_reset: usage?.last_scan_reset || new Date().toISOString(),
        });

      if (updateError) throw updateError;
      
      // Refetch usage data to update the UI
      await refetchUsage();

      setHealthScore({
        score: analysisData.score,
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
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Scan Ingredients</h2>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Take a photo or upload an image of your cat food ingredients
          </p>
          {session && (
            <p className="text-sm font-medium">
              Remaining scans this month: <span className="text-primary">{getRemainingScans()}</span>
            </p>
          )}
        </div>
        
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