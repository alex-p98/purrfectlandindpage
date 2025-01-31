import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAddCat } from "@/hooks/useAddCat";

export const EmptyCatProfile = () => {
  const { addCat } = useAddCat();

  return (
    <Card
      className="p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer scale-animation"
      onClick={addCat}
    >
      <PlusCircle className="h-12 w-12 text-primary" />
      <p className="text-sm text-muted-foreground">Add a Cat</p>
    </Card>
  );
};