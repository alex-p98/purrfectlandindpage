import { Card } from "@/components/ui/card";
import { CameraCapture } from "./scanner/CameraCapture";
import { ImagePreview } from "./scanner/ImagePreview";
import { ScannerHeader } from "./scanner/ScannerHeader";
import { CaptureOptions } from "./scanner/CaptureOptions";
import { AnalysisResult } from "./scanner/AnalysisResult";
import { useScannerState } from "./scanner/useScannerState";

export const Scanner = () => {
  const {
    showCamera,
    setShowCamera,
    capturedImage,
    setCapturedImage,
    isScanning,
    healthScore,
    setHealthScore,
    handleFileUpload,
    handleScanIngredients,
  } = useScannerState();

  return (
    <>
      <Card className="p-8 flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 wave-pattern" />
        
        <ScannerHeader />

        {!capturedImage ? (
          <CaptureOptions
            onCameraClick={() => setShowCamera(true)}
            onFileUpload={handleFileUpload}
          />
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
              <AnalysisResult 
                score={healthScore.score}
                explanation={healthScore.explanation}
              />
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