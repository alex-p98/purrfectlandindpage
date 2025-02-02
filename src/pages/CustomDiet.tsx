import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface DietSection {
  title: string;
  content: string[];
}

interface CatInfo {
  id: string;
  name: string;
  weight: string | null;
  age: string;
  breed: string;
  allergies: string | null;
  health_condition: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  notes: string | null;
  diet_plan: DietSection[] | null;
}

const CustomDiet = () => {
  const { session } = useAuth();
  const [selectedCat, setSelectedCat] = useState<CatInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietSections, setDietSections] = useState<DietSection[]>([]);
  const queryClient = useQueryClient();

  const { data: cats, isLoading } = useQuery({
    queryKey: ['cats', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data as any[]).map(cat => ({
        ...cat,
        diet_plan: cat.diet_plan as DietSection[] | null
      })) as CatInfo[];
    },
    enabled: !!session?.user.id,
  });

  const saveDietPlanMutation = useMutation({
    mutationFn: async ({ catId, dietPlan }: { catId: string; dietPlan: DietSection[] }) => {
      const { error } = await supabase
        .from('cats')
        .update({ diet_plan: dietPlan as unknown as Json })
        .eq('id', catId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      toast.success('Diet plan saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving diet plan:', error);
      toast.error('Failed to save diet plan. Please try again.');
    },
  });

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
          weight: formatWeight(selectedCat.weight),
          age: selectedCat.age,
          allergies: selectedCat.allergies,
          healthCondition: selectedCat.health_condition
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet');
      }

      const responseText = await response.text();
      const parsedSections = parseMarkdownResponse(responseText);
      setDietSections(parsedSections);
      
      await saveDietPlanMutation.mutateAsync({
        catId: selectedCat.id,
        dietPlan: parsedSections
      });

    } catch (error) {
      console.error('Error generating diet:', error);
      toast.error("Failed to generate diet. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <main className="container max-w-md mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-primary">Custom Diet</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary/80">Select Your Cat</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {cats?.map((cat) => (
                  <Card 
                    key={cat.name}
                    className={`p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors border-primary/20 ${
                      selectedCat?.name === cat.name ? 'bg-accent' : ''
                    }`}
                    onClick={() => {
                      setSelectedCat(cat);
                      if (cat.diet_plan) {
                        setDietSections(cat.diet_plan);
                      } else {
                        setDietSections([]);
                      }
                    }}
                  >
                    <Avatar className="w-20 h-20">
                      <AvatarImage 
                        src={cat.image_url || "/placeholder.svg"}
                        alt={cat.name}
                        className="object-cover"
                      />
                      <AvatarFallback>{cat.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Card>
                ))}
              </div>

              {!cats?.length && (
                <p className="text-muted-foreground text-sm mt-4">
                  No cats found. Add a cat first to generate a custom diet plan.
                </p>
              )}

              {!selectedCat && cats?.length > 0 && (
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
                    <p className="text-xl">{formatWeight(selectedCat.weight)}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Age</h4>
                    <p className="text-xl">{selectedCat.age}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Allergies</h4>
                    <p className="text-xl">{selectedCat.allergies || 'None'}</p>
                  </div>

                  <div>
                    <h4 className="text-lg text-primary/80">Health</h4>
                    <p className="text-xl">{selectedCat.health_condition || 'Generally healthy'}</p>
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