import { Header } from "@/components/Header";
import { Scanner } from "@/components/Scanner";
import { CatProfile } from "@/components/CatProfile";
import { RecentScans } from "@/components/RecentScans";
import { BottomNav } from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const { session } = useAuth();

  const { data: cats, isLoading } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container max-w-md mx-auto pt-16 sm:pt-8 p-4 space-y-8">
        <Scanner />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Cats</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[200px] bg-muted animate-pulse rounded-lg" />
              <div className="h-[200px] bg-muted animate-pulse rounded-lg" />
            </div>
          ) : cats && cats.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {cats.map((cat) => (
                  <CarouselItem key={cat.id} className="pl-2 md:pl-4 basis-1/2">
                    <CatProfile 
                      id={cat.id} 
                      name={cat.name} 
                      imageUrl={cat.image_url} 
                    />
                  </CarouselItem>
                ))}
                <CarouselItem className="pl-2 md:pl-4 basis-1/2">
                  <CatProfile />
                </CarouselItem>
              </CarouselContent>
              {cats.length > 1 && (
                <>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <CatProfile />
            </div>
          )}
        </div>

        <RecentScans />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;