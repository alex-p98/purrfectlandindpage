import { Header } from "@/components/Header";
import { Scanner } from "@/components/Scanner";
import { CatProfile } from "@/components/CatProfile";
import { RecentScans } from "@/components/RecentScans";
import { BottomNav } from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <div className="h-[200px] bg-muted animate-pulse rounded-lg" />
                <div className="h-[200px] bg-muted animate-pulse rounded-lg" />
              </>
            ) : cats && cats.length > 0 ? (
              <>
                {cats.map((cat) => (
                  <CatProfile key={cat.id} name={cat.name} imageUrl={cat.image_url} />
                ))}
                <CatProfile />
              </>
            ) : (
              <CatProfile />
            )}
          </div>
        </div>

        <RecentScans />
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;