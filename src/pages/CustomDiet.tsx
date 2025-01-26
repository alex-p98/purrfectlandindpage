import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useState } from "react";

interface CatInfo {
  name: string;
  weight: string;
  age: string;
  allergies: string;
  healthCondition: string;
  image: string;
}

const CustomDiet = () => {
  const [selectedCat, setSelectedCat] = useState<CatInfo | null>(null);

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
                >
                  Generate Custom Diet
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default CustomDiet;