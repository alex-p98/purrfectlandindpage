import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";

const CatProfile = () => {
  const navigate = useNavigate();
  const { name } = useParams();

  // TODO: Fetch cat data from database
  const catData = {
    name: name,
    breed: "Persian",
    age: "2 years",
    weight: "4.5 kg",
    allergies: "Fish, Dairy",
    healthCondition: "Generally healthy, regular checkups required",
    notes: "Loves to sleep and play with yarn",
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-md mx-auto pt-8 p-4 space-y-8">
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

        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-4xl font-semibold">
              {catData.name?.[0].toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold">{catData.name}</h2>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Breed</h3>
              <p>{catData.breed}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p>{catData.age}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
              <p>{catData.weight}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Allergies</h3>
              <p>{catData.allergies}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Health Condition</h3>
              <p>{catData.healthCondition}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p>{catData.notes}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CatProfile;