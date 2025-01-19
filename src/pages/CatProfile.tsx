import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit, Heart, Weight, Stethoscope, AlertCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CatProfile = () => {
  const navigate = useNavigate();
  const { name } = useParams();

  // TODO: Fetch cat data from database
  const catData = {
    name: name,
    breed: "Tuxedo",
    age: "2 years",
    weight: "4.5 kg",
    allergies: "Fish, Dairy",
    healthCondition: "Generally healthy, regular checkups required",
    notes: "Loves to sleep and play with yarn",
    image: "/lovable-uploads/ae15ab81-e4b2-4296-8454-d8ee35d09389.png"
  };

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
            <AvatarImage src={catData.image} alt={catData.name} className="object-cover" />
            <AvatarFallback className="text-4xl">
              {catData.name?.[0].toUpperCase()}
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
                <p className="text-lg font-semibold">{catData.weight}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5">
            <CardContent className="pt-6 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Allergies</h3>
                <p className="text-lg font-semibold">{catData.allergies}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 md:col-span-2">
            <CardContent className="pt-6 flex items-center gap-4">
              <Stethoscope className="h-8 w-8 text-secondary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Health Condition</h3>
                <p className="text-lg">{catData.healthCondition}</p>
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
            <p className="text-muted-foreground">{catData.notes}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CatProfile;