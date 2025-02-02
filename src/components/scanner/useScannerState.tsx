import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

type UserUsage = Database['public']['Tables']['user_usage']['Row'];

export const useScannerState = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [healthScore, setHealthScore] = useState<{ score: number; explanation: string } | null>(null);
  const [scansLeft, setScansLeft] = useState<number>(0);
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    if (session?.user) {
      fetchUserScans();
      
      const channel = supabase
        .channel('user-usage-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_usage',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload: RealtimePostgresChangesPayload<UserUsage>) => {
            if (payload.new && 'scans_this_month' in payload.new) {
              const newScansThisMonth = payload.new.scans_this_month ?? 0;
              setScansLeft(2 - newScansThisMonth);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const paymentCancelled = searchParams.get('payment_cancelled');

    if (paymentSuccess === 'true') {
      toast({
        title: "Payment Successful",
        description: "Your scans have been added to your account.",
      });
      fetchUserScans();
    } else if (paymentCancelled === 'true') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No scans were added.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  return {
    showCamera,
    setShowCamera,
    capturedImage,
    setCapturedImage,
    isScanning,
    healthScore,
    setHealthScore,
    scansLeft,
    handleFileUpload,
    handleScanIngredients,
  };
};