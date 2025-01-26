import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";

const CustomDiet = () => {
  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <main className="container max-w-md mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Custom Diet</h1>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Your Cat</h2>
            
            <Card className="p-4 w-[140px] flex flex-col items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors">
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

            <p className="text-muted-foreground text-sm">
              Select a cat to generate a custom diet
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default CustomDiet;