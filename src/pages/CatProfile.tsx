import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Heart, Weight, Stethoscope, AlertCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CatProfile = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const { session } = useAuth();

  const { data: catData, isLoading } = useQuery({
    queryKey: ['cat', name],
    queryFn: async () => {
      if (!session?.user.id) return null;
      
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .eq('user_id', session.user.id)
        .ilike('name', name || '')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id && !!name,
  });

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
          <p>This cat profile doesn't exist or you don't have access to it.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-2xl mx-auto pt-8 p-4 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Cat Profile</h1>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Avatar className="w-48 h-48 rounded-full border-4 border-primary">
            <AvatarImage 
              src={catData.image_url || "/placeholder.svg"} 
              alt={catData.name} 
              className="object-cover" 
            />
            <AvatarFallback className="text-4xl">
              {catData.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
                <p className="text-lg font-semibold">{catData.weight || 'Not specified'}</p>
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
    </div>
  );
};

export default CatProfile;