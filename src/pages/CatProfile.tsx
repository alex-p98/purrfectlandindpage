import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Heart, Weight, Stethoscope, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CameraCapture } from "@/components/scanner/CameraCapture";
import { ProfilePicture } from "@/components/cat/ProfilePicture";
import { useProfilePicture } from "@/components/cat/useProfilePicture";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EditCatForm } from "@/components/cat/EditCatForm";
import { useState } from "react";

const CatProfile = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data: catData, isLoading } = useQuery({
    queryKey: ['cat', name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .ilike('name', name || '')
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!name,
  });

  const {
    showCamera,
    setShowCamera,
    fileInputRef,
    handleFileUpload,
    handleCapture,
  } = useProfilePicture(catData?.id);

  const formatWeight = (weight: string | null) => {
    if (!weight) return 'Not specified';
    
    const isKilos = weight.toLowerCase().includes('kg') || 
                   weight.toLowerCase().includes('kilo');
    
    const numericWeight = parseFloat(weight.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericWeight)) return weight;
    
    if (isKilos) {
      const pounds = (numericWeight * 2.20462).toFixed(1);
      return `${pounds} lbs`;
    }
    
    return `${numericWeight} lbs`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!catData) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container max-w-2xl mx-auto pt-8 p-4 space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Cat Not Found</h1>
          </div>
          <Alert>
            <AlertDescription>
              This cat profile doesn't exist.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const canEdit = session?.user.id === catData.user_id;

  if (isEditing && canEdit) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container max-w-2xl mx-auto pt-8 p-4 space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Cat Profile</h1>
          </div>
          <EditCatForm 
            cat={catData} 
            onSuccess={() => setIsEditing(false)} 
            onCancel={() => setIsEditing(false)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />
      <main className="container max-w-2xl mx-auto pt-8 p-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Cat Profile</h1>
          </div>
          {canEdit && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <ProfilePicture
              imageUrl={catData.image_url}
              name={catData.name}
              onCameraClick={() => setShowCamera(true)}
              onUploadClick={() => fileInputRef.current?.click()}
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{catData.name}</h2>
            <p className="text-muted-foreground">{catData.breed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="pt-6 flex items-center gap-4">
              <Weight className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
                <p className="text-lg font-semibold">{formatWeight(catData.weight)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5">
            <CardContent className="pt-6 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Allergies</h3>
                <p className="text-lg font-semibold">{catData.allergies || 'None'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 md:col-span-2">
            <CardContent className="pt-6 flex items-center gap-4">
              <Stethoscope className="h-8 w-8 text-secondary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Health Condition</h3>
                <p className="text-lg">{catData.health_condition || 'No health conditions reported'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Notes</h3>
            </div>
            <p className="text-muted-foreground">{catData.notes || 'No notes added'}</p>
          </CardContent>
        </Card>
      </main>

      <CameraCapture
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default CatProfile;