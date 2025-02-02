import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

export const useScannerState = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthScore, setHealthScore] = useState<{ score: number; explanation: string } | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return {
    showCamera,
    setShowCamera,
    capturedImage,
    setCapturedImage,
    isScanning,
    healthScore,
    setHealthScore,
    handleFileUpload,
    handleScanIngredients,
  };
};