import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useState } from "react";
import { toast } from "sonner";

interface CatInfo {
  name: string;
  weight: string;
  age: string;
  allergies: string;
  healthCondition: string;
  image: string;
}

interface DietPlan {
  meals: {
    name: string;
    ingredients: string[];
    instructions: string;
  }[];
  recommendations: string[];
}

const CustomDiet = () => {
  const [selectedCat, setSelectedCat] = useState<CatInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const handleGenerateDiet = async () => {
    if (!selectedCat) {
      toast.error("Please select a cat first");
      return;
    }

    setIsGenerating(true);
    setDietPlan(null);
    
    try {
      const response = await fetch('https://hook.us2.make.com/om2urxc9mn2w7e6q4x6v8sttde8tqai2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCat)
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText); // Debug log

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Validate the response structure
      if (!data.meals || !Array.isArray(data.meals) || !data.recommendations) {
        throw new Error('Invalid diet plan format');
      }

      setDietPlan(data);
      toast.success("Custom diet plan generated successfully!");
    } catch (error) {
      console.error('Error generating diet:', error);
      toast.error("Failed to generate diet. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <main className="container max-w-md mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Custom Diet</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Your Cat</h2>
              
              <Card className="p-4 w-[140px] flex flex-col items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedCat({
                      name: "Whiskers",
                      weight: "4.5 kg",
                      age: "3 years",
                      allergies: "Fish, Dairy",
                      healthCondition: "Generally healthy, regular checkups required",
                      image: "/lovable-uploads/ae15ab81-e4b2-4296-8454-d8ee35d09389.png"
                    })}>
                <Avatar className="w-20 h-20">
                  <AvatarImage 
                    src="/lovable-uploads/ae15ab81-e4b2-4296-8454-d8ee35d09389.png"
                    alt="Whiskers"
                    className="object-cover"
                  />
                  <AvatarFallback>W</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Whiskers</span>
              </Card>

              {!selectedCat && (
                <p className="text-muted-foreground text-sm mt-4">
                  Select a cat to view their information and generate a custom diet
                </p>
              )}
            </div>

            {selectedCat && (
              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-semibold text-primary">Cat Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg text-primary/80">Weight</h4>
                    <p className="text-xl">{selectedCat.weight}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Age</h4>
                    <p className="text-xl">{selectedCat.age}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Allergies</h4>
                    <p className="text-xl">{selectedCat.allergies}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Health</h4>
                    <p className="text-xl">{selectedCat.healthCondition}</p>
                  </div>
                </div>

                <Button 
                  className="w-full text-lg py-6"
                  variant="default"
                  onClick={handleGenerateDiet}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Custom Diet"}
                </Button>
              </Card>
            )}

            {dietPlan && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Custom Diet Plan</h3>
                
                {dietPlan.meals.map((meal, index) => (
                  <Card key={index} className="p-6 space-y-4">
                    <h4 className="text-xl font-semibold text-primary">{meal.name}</h4>
                    
                    <div>
                      <h5 className="text-lg font-medium mb-2">Ingredients:</h5>
                      <ul className="list-disc pl-6 space-y-1">
                        {meal.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-muted-foreground">{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium mb-2">Instructions:</h5>
                      <p className="text-muted-foreground">{meal.instructions}</p>
                    </div>
                  </Card>
                ))}

                <Card className="p-6">
                  <h4 className="text-xl font-semibold text-primary mb-4">Recommendations</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {dietPlan.recommendations.map((rec, index) => (
                      <li key={index} className="text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default CustomDiet;