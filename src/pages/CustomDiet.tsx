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
  breed: string;
  allergies: string;
  healthCondition: string;
  image: string;
}

interface DietSection {
  title: string;
  content: string[];
}

const CustomDiet = () => {
  const [selectedCat, setSelectedCat] = useState<CatInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietSections, setDietSections] = useState<DietSection[]>([]);

  const parseMarkdownResponse = (markdown: string) => {
    const sections: DietSection[] = [];
    const lines = markdown.split('\n');
    let currentSection: DietSection | null = null;

    lines.forEach(line => {
      const cleanLine = line.trim()
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/\*\*/g, '')
        .replace(/\*/g, '');
      
      if (cleanLine.startsWith('### ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: cleanLine.replace('### ', '').trim(),
          content: []
        };
      } 
      else if (cleanLine.startsWith('- ') && currentSection) {
        const content = cleanLine.replace('- ', '').trim();
        if (content) {
          currentSection.content.push(content);
        }
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const handleGenerateDiet = async () => {
    if (!selectedCat) {
      toast.error("Please select a cat first");
      return;
    }

    setIsGenerating(true);
    setDietSections([]);
    
    try {
      const response = await fetch('https://hook.us2.make.com/om2urxc9mn2w7e6q4x6v8sttde8tqai2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCat.name,
          breed: selectedCat.breed,
          weight: selectedCat.weight,
          age: selectedCat.age,
          allergies: selectedCat.allergies,
          healthCondition: selectedCat.healthCondition
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet');
      }

      const responseText = await response.text();
      const parsedSections = parseMarkdownResponse(responseText);
      setDietSections(parsedSections);
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
          <h1 className="text-3xl font-bold mb-6 text-primary">Custom Diet</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary/80">Select Your Cat</h2>
              
              <Card className="p-4 w-[140px] flex flex-col items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors border-primary/20"
                    onClick={() => setSelectedCat({
                      name: "Whiskers",
                      breed: "Tuxedo",
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
              <Card className="p-6 space-y-6 border-primary/20 shadow-md">
                <h3 className="text-xl font-semibold text-primary">Cat Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg text-primary/80">Breed</h4>
                    <p className="text-xl">{selectedCat.breed}</p>
                  </div>

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
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
                  onClick={handleGenerateDiet}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Custom Diet"}
                </Button>
              </Card>
            )}

            {dietSections.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-primary">Custom Diet Plan</h3>
                
                {dietSections.map((section, index) => (
                  <Card key={index} className="p-6 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                    <h4 className="text-xl font-semibold text-primary mb-4">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.content.map((item, idx) => (
                        <li key={idx} className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
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