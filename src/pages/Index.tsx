import { Header } from "@/components/Header";
import { Scanner } from "@/components/Scanner";
import { CatProfile } from "@/components/CatProfile";
import { RecentScans } from "@/components/RecentScans";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md mx-auto pt-32 p-4 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            The best place to check your
            <span className="text-primary"> cat's diet</span>
          </h1>
          <p className="text-muted-foreground">
            Discover what's in your cat's food and ensure they get the best nutrition
          </p>
        </div>

        <Scanner />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Cats</h2>
          <div className="grid grid-cols-2 gap-4">
            <CatProfile name="Whiskers" onClick={() => {}} />
            <CatProfile onClick={() => {}} />
          </div>
        </div>

        <RecentScans />
      </main>
    </div>
  );
};

export default Index;