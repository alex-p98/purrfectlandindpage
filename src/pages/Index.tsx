import { Header } from "@/components/Header";
import { Scanner } from "@/components/Scanner";
import { CatProfile } from "@/components/CatProfile";
import { RecentScans } from "@/components/RecentScans";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-8">
      <Header />
      <main className="container max-w-md mx-auto pt-16 sm:pt-8 p-4 space-y-8">
        <Scanner />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Cats</h2>
          <div className="grid grid-cols-2 gap-4">
            <CatProfile name="Whiskers" />
            <CatProfile />
          </div>
        </div>

        <RecentScans />
      </main>
    </div>
  );
};

export default Index;